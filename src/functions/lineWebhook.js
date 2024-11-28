const { app } = require("@azure/functions");
const {
  quickReply,
  replyMessage,
  getUserProfile,
  pushMessage,
} = require("../services/lineMessaging.service");
const { submitToOpenAI } = require("./gpt.service");
const { getUserByLineId, createUser } = require("./database.service");

app.http("lineWebhook", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const body = await request.text();
      const bodyJson = JSON.parse(body);
      const events = bodyJson?.events;

      if (events && events.length > 0) {
        const event = events[0];
        const userId = event?.source?.userId;
        const replyToken = event?.replyToken;
        const eventType = event?.type;
        let user = await getUserByLineId(userId);

        if (!user) {
          user = await getUserProfile(userId);
          await createUser({
            lineId: userId,
            username: user.displayName,
          });
        }

        if (eventType === "postback") {
          const action = event?.postback?.data?.split("=")[1];

          if (action === "q&a") {
            await quickReply({ to: userId, replyToken });
          }
        } else if (eventType === "message") {
          const {
            messageType,
            openAIReplyMessage,
            openAIReplyFlexMessage,
            secondOpenAIReplyMessage,
            altText,
          } = await submitToOpenAI({
            user,
            message: event?.message?.text,
          });
          context.log("messageType:", messageType);
          messageType === "flex"
            ? await replyMessage({
                messageType,
                contents: openAIReplyFlexMessage,
                altText,
                replyToken,
              })
            : await replyMessage({
                messageType,
                messageText: openAIReplyMessage,
                replyToken,
              });

          if (secondOpenAIReplyMessage) {
            await pushMessage({
              to: userId,
              messageText: secondOpenAIReplyMessage,
            });
          }
        }
      }
      return { status: 200 };
    } catch (error) {
      context.error("error:", error?.data);
      return { body: `${error}` };
    }
  },
});
