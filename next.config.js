const dotenv = require("dotenv");

dotenv.config();

console.log("hey =>", process.env.SPOTIFY_CLIENT_ID);

module.exports = {
    target: "serverless",

    // webpack: (config, { webpack }) => {
    //     config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//));
    //     return config;
    // },
};
