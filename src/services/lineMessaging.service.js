const axiosInstance = require("../utils/axiosInstance");
const LINE_REPLY_URL = "https://api.line.me/v2/bot/message/reply";
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env?.CHANNEL_ACCESS_TOKEN}`,
};

const getImageContent = async ({ messageId = "", returnType = "base64" }) => {
  try {
    const url = `https://api-data.line.me/v2/bot/message/${messageId}/content`;

    const response = await axiosInstance({
      method: "get",
      url: url,
      responseType: "arraybuffer",
      headers,
    });
    if (returnType === "base64") {
      const base64Image = Buffer.from(response.data, "binary").toString(
        "base64"
      );

      const contentType = response.headers["content-type"];
      const base64WithPrefix = `data:${contentType};base64,${base64Image}`;

      return base64WithPrefix;
    }
    return Buffer.from(response.data, "binary");
  } catch (error) {
    console.error("Error getting image from LINE:", error);
    throw new Error(`Failed to get image content: ${error.message}`);
  }
};

const getUserProfile = async (lineID) => {
  const response = await axiosInstance.get(
    `https://api.line.me/v2/bot/profile/${lineID}`,
    { headers }
  );
  return response;
};

const replyMessage = async ({
  messageType = "flex",
  messageText = "",
  contents = {},
  replyToken = "",
  altText = "",
}) => {
  const data = {
    replyToken: replyToken,
    messages: [
      messageType === "flex"
        ? {
            type: messageType,
            altText,
            contents,
          }
        : { type: messageType, text: messageText },
    ],
  };

  try {
    const response = await axiosInstance.post(LINE_REPLY_URL, data, {
      headers: headers,
    });
    return { status: "ok", message: "Message sented" };
  } catch (error) {
    return { status: "fail", message: String(error) };
  }
};

const pushMessage = async ({
  to = "",
  messageText = "",
  messageType = "text",
  altText = "",
  contents = {},
}) => {
  try {
    const data = {
      to: to,
      messages: [
        messageType === "text"
          ? { type: "text", text: messageText }
          : {
              type: messageType,
              altText,
              contents,
            },
      ],
    };
    await axiosInstance.post("https://api.line.me/v2/bot/message/push", data, {
      headers,
    });
    return { status: "success" };
  } catch (error) {
    console.error("Error pushing message:", error);
    throw error;
  }
};

const quickReply = async ({ to = "", replyToken = "" }) => {
  try {
    const response = await axiosInstance.post(
      "https://api.line.me/v2/bot/message/reply",
      {
        replyToken,
        messages: [
          {
            type: "text",
            text: "คุณลูกค้าต้องการถามข้อมูลด้านไหนบ้างคะ?",
            quickReply: {
              items: [
                {
                  type: "action",
                  action: {
                    type: "message",
                    label: "ใช้สิทธิบัตรทอง",
                    text: "สามารถใช้สิทธิบัตรทองที่ร้าน HealthMate ได้อย่างไร?",
                  },
                },
                {
                  type: "action",
                  action: {
                    type: "message",
                    label: "คำแนะนำอาการป่วย",
                    text: "HealthMate ให้คำแนะนำเกี่ยวกับอาการป่วยแบบไหนบ้าง?",
                  },
                },
                {
                  type: "action",
                  action: {
                    type: "message",
                    label: "โครงการที่เข้าร่วม",
                    text: "ร้าน HealthMate เข้าร่วมโครงการอะไรบ้าง?",
                  },
                },
              ],
            },
          },
        ],
      },
      { headers }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  replyMessage,
  getUserProfile,
  getImageContent,
  pushMessage,
  quickReply,
};
