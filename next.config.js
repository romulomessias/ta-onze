const dotenv = require("dotenv");

dotenv.config();

const { SLACK_CLIENT_ID } = process.env;

module.exports = {
    target: "serverless",
    webpack5: true,
    env: {
        SLACK_CLIENT_ID,
    },
};
