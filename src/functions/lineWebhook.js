const { app } = require("@azure/functions");

app.http("lineWebhook", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);

    return { status: 200 };
  },
});
