const dotenv = require("dotenv");

dotenv.config();

console.log("hey =>", process.env.SPOTIFY_CLIENT_ID);

module.exports = {
    target: "serverless",
    future: {
        webpack5: true,
    },
};
