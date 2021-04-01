const options = {
  swagger: "2.0",
  info: {
    title: "TransferWise Express API",
    version: "1.0.0",
    description: "Simple Express API",
    contact: {
      name: "Vasyl Shponarskyi",
      email: "vasyl.shponarskyi@gmail.com",
    },
    license: {
      name: "MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
  },
  servers: [
    {
      url: "http://localhost:3000/trm",
      description: "Local server",
    },
  ],
  tags: [
    {
      name: "GET",
    },
    {
      name: "POST",
    },
  ],
  paths: {
    "/trm": {
      get: {
        tags: ["GET"],
        description: "Get data from Firebase",
        operationId: "getData",
        responses: {
          200: {
            description: "Successful request",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["POST"],
        description: "Request current rate",
        operationId: "request",
        consumes: ["application/json"],
        parameters: [
          {
            name: "source",
            in: "body",
            content: {
              "text/plain": {
                type: "string",
              },
            },
          },
          {
            name: "target",
            in: "body",
            content: {
              "text/plain": {
                type: "string",
              },
            },
          },
        ],
        responses: {
          200: {
            description: "Successful request",
            content: {
              "application/json": {
                schema: {
                  "text/plain": {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = options;
