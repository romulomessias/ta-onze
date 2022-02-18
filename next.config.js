const dotenv = require("dotenv");

dotenv.config();

const { SLACK_CLIENT_ID } = process.env;

module.exports = {
    webpack5: true,
    images: {
        domains: ['mosaic.scdn.co', 'i.scdn.co'],
      },
    env: {
        SLACK_CLIENT_ID,
    },
};
