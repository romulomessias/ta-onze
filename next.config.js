const dotenv = require("dotenv");

dotenv.config();

module.exports = {
    target: "serverless",
    future: {
        webpack5: true,
    },
    env: {
        SLACK_CLIENT_ID,
    },
};
