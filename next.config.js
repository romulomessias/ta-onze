const dotenv = require("dotenv");

dotenv.config();

const { SLACK_CLIENT_ID } = process.env;

module.exports = {
    target: "serverless",
    webpack5: true,
    images: {
        domains: ['mosaic.scdn.co'],
      },
    env: {
        SLACK_CLIENT_ID,
    },
};
