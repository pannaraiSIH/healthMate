const OpenAI = require("openai");
const { COMPLETION_TEMPLATE } = require("../config/aiCompletion");
const {
  createUcsHistory,
  getUcsHistoryByUserId,
} = require("./database.service");
const {
  confirmFlexMessage,
  detailFlexMessage,
  ucsHistoryRows,
  ucsHistoryFlexMessage,
} = require("../constants/flexMessage");
const dateFormatter = require("../utils/dateFormatter");

const customerSymptoms = {};

const submitToOpenAI = async ({ user, message }) => {
  try {
    const openAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const chatCompletions = { ...COMPLETION_TEMPLATE };
    let openAIReplyMessage = null;
    let openAIReplyFlexMessage = null;
    let secondOpenAIReplyMessage = null;
    let altText = null;
    let messageType = "text";

    chatCompletions.messages.push({
      role: "user",
      content: [{ type: "text", text: `${message}`.toLowerCase() }],
    });

    const openAIResponse = await openAI.chat.completions.create(
      chatCompletions
    );
    const choice = openAIResponse?.choices?.[0];
    chatCompletions.messages.push(choice?.message);
    openAIReplyMessage = choice?.message?.content;

    if (choice && choice?.finish_reason === "tool_calls") {
      const toolCalls = choice?.message?.tool_calls;

      for (const toolCall of toolCalls) {
        const toolId = toolCall?.id;
        const toolName = toolCall?.function?.name;
        const toolArg = JSON.parse(toolCall?.function?.arguments);
        let toolResponse = "";

        if (toolName === "store_customer_symptoms") {
          customerSymptoms[user.line_id] = toolArg?.symptoms?.join(" ");
          toolResponse = "บันทึกอาการของลูกค้าเรียบร้อย";
        } else if (toolName === "ask_for_confirmation_ucs") {
          toolResponse = "กดเลือกเพื่อทำการยืนยันค่ะ";
          messageType = "flex";
          altText = "ยืนยันการใช้สิทธิบัตรทอง";
          openAIReplyFlexMessage = confirmFlexMessage({
            username: user.username,
            illnesses: customerSymptoms[user.line_id],
            bookedDate: dateFormatter.format(new Date()),
          });
        } else if (toolName === "confirm_ucs") {
          toolResponse = "ยืนยันการใช้สิทธิบัตรทองเรียบร้อยและกล่าวลาลูกค้า";
          const history = await createUcsHistory({
            userId: user.line_id,
            symptom: customerSymptoms[user.line_id],
            bookedDate: new Date(),
          });
          messageType = "flex";
          altText = "รายละเอียดการใช้สิทธิบัตรทอง";
          openAIReplyFlexMessage = detailFlexMessage({
            username: user.username,
            illnesses: history?.symptom,
            bookedDate: dateFormatter.format(history?.bookedDate),
            bookingId: history?.historyId,
          });
        } else if (toolName === "ucs_history") {
          toolResponse = "ประวัติการใช้สิทธิทั้งหมดของคุณลูกค้า";

          const ucsHistory = await getUcsHistoryByUserId(user.line_id);
          const rows = ucsHistoryRows(ucsHistory?.history || []);
          messageType = "flex";
          altText = "ประวัติการใช้สิทธิบัตรทอง";
          openAIReplyFlexMessage = ucsHistoryFlexMessage(rows);
        }

        chatCompletions.messages.push({
          role: "tool",
          content: [{ type: "text", text: toolResponse }],
          tool_call_id: toolId,
        });

        const responseAfterToolCall = await openAI.chat.completions.create(
          chatCompletions
        );
        chatCompletions.messages.push(
          responseAfterToolCall?.choices[0]?.message
        );
        openAIReplyMessage =
          responseAfterToolCall?.choices[0]?.message?.content;

        if (toolName === "confirm_ucs") {
          chatCompletions.messages.push({
            role: "system",
            content: "หลังจากที่ลูกค้ากดยืนยันแล้วให้กล่าวลาลูกค้า",
          });
          const response = await openAI.chat.completions.create(
            chatCompletions
          );
          secondOpenAIReplyMessage = response?.choices?.[0]?.message?.content;
        }
      }
    }

    return {
      messageType,
      openAIReplyMessage,
      openAIReplyFlexMessage,
      secondOpenAIReplyMessage,
      altText,
    };
  } catch (error) {
    console.log("error:", error);
    throw error;
  }
};

module.exports = { submitToOpenAI };
