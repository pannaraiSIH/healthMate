const { app } = require("@azure/functions");
const {
  setDefaultRichMenu,
  getRichMenuList,
  createRichMenu,
  attachImageToRichMenu,
} = require("../services/richMenu.service");

app.http("richMenu", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      let response = null;

      if (request.method === "GET") {
        response = await getRichMenuList();
      } else {
        response = await createRichMenu();
        const richMenuId = response?.richMenuId;
        await attachImageToRichMenu({
          richMenuId,
        });
        await setDefaultRichMenu({
          richMenuId,
        });
      }

      return { body: JSON.stringify(response) };
    } catch (error) {
      return { body: `${error}` };
    }
  },
});
