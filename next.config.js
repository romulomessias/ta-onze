const dotenv = require("dotenv");

dotenv.config();

const { SLACK_CLIENT_ID } = process.env;
console.log("hey =>", SLACK_CLIENT_ID);

module.exports = {
    target: "serverless",
    future: {
        webpack5: true,
    },
    env: {
        SLACK_CLIENT_ID,
    },
};
