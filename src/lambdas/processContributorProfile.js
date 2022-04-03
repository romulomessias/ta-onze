const https = require("https");

const postProfile = (contributorId) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: "www.taonze.com.br",
            path: "/api/contributors/" + contributorId,
            method: "POST",
            port: 443,
            headers: {
                "Content-Type": "application/json",
            },
        };

        const req = https.request(options, (res) => {
            let rawData = "";

            res.on("data", (chunk) => {
                rawData += chunk;
            });

            res.on("end", () => {
                ``;
                resolve(JSON.parse(rawData));
            });
        });

        req.on("error", (err) => {
            reject(new Error(err));
        });
        req.write(JSON.stringify({ contributorId }));
        req.end();
    });
};
exports.handler = async (event, context) => {
    const [record] = event.Records;
    const contributorId = record.messageAttributes.Id.stringValue;

    console.log("processContributorProfile", contributorId);
    try {
        const result = await postProfile(contributorId);
        console.log("got profile for", contributorId, { result });
        return { contributorId };
    } catch (err) {
        console.error("something got wrong", contributorId, err);
        return { err };
    }
};
