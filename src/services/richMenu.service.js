const fs = require("fs/promises");
const path = require("path");
const axiosInstance = require("../utils/axiosInstance");

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env?.CHANNEL_ACCESS_TOKEN}`,
};

const getRichMenuList = async () => {
  try {
    const response = await axiosInstance.get(
      "https://api.line.me/v2/bot/richmenu/list",
      { headers }
    );
    return response;
  } catch (error) {
    const errorMessage =
      error?.data?.message || error?.message || "Failed to get rich menu list";
    throw new Error(errorMessage);
  }
};

const createRichMenu = async () => {
  try {
    const richMenuLayout = {
      size: {
        width: 800,
        height: 270,
      },
      selected: true,
      name: "HealthMate rich menu",
      chatBarText: "เมนู",
      areas: [
        {
          bounds: {
            x: 0,
            y: 0,
            width: 400,
            height: 270,
          },
          action: {
            type: "message",
            label: "ประวัติการใช้บัตรทอง",
            text: "ประวัติการใช้บัตรทอง",
          },
        },
        {
          bounds: {
            x: 400,
            y: 0,
            width: 400,
            height: 270,
          },
          action: {
            type: "postback",
            label: "Q&A",
            data: "action=q&a",
            displayText: "Q&A",
          },
        },
      ],
    };
    const response = await axiosInstance.post(
      "https://api.line.me/v2/bot/richmenu",
      richMenuLayout,
      { headers }
    );
    return response;
  } catch (error) {
    const errorMessage =
      error?.data?.message || error?.message || "Failed to create rich menu";
    throw new Error(errorMessage);
  }
};

const attachImageToRichMenu = async ({ richMenuId }) => {
  try {
    const imageBuffer = await fs.readFile(
      path.resolve(__dirname, "../../image.png")
    );
    const response = await axiosInstance.post(
      `https://api-data.line.me/v2/bot/richmenu/${richMenuId}/content`,
      imageBuffer,
      {
        headers: {
          ...headers,
          "Content-Type": "image/png",
        },
      }
    );
    return response;
  } catch (error) {
    const errorMessage =
      error?.data?.message ||
      error?.message ||
      "Failed to attach image to rich menu";
    throw new Error(errorMessage);
  }
};

const setDefaultRichMenu = async ({ richMenuId }) => {
  try {
    const response = await axiosInstance.post(
      `https://api.line.me/v2/bot/user/all/richmenu/${richMenuId}`,
      {},
      { headers: { Authorization: headers.Authorization } }
    );
    return response;
  } catch (error) {
    const errorMessage =
      error?.data?.message ||
      error?.message ||
      "Failed to set default rich menu";
    throw new Error(errorMessage);
  }
};

const deleteRichMenu = async ({ richMenuId }) => {
  try {
    const response = await axiosInstance.delete(
      `https://api.line.me/v2/bot/richmenu/${richMenuId}`,
      {
        headers: {
          Authorization: headers.Authorization,
        },
      }
    );
    return response;
  } catch (error) {
    const errorMessage =
      error?.data?.message || error?.message || "Failed to delete rich menu";
    throw new Error(errorMessage);
  }
};

module.exports = {
  getRichMenuList,
  createRichMenu,
  attachImageToRichMenu,
  setDefaultRichMenu,
  deleteRichMenu,
};
