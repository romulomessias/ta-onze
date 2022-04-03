const https = require("https");

exports.handler = async (event, context) => {
    const [record] = event.Records;
    const contributorId = record.messageAttributes.Id.stringValue;
    console.log({ contributorId });
    console.log("processContributorProfile :D");

    https.post("https://www.taonze.com.br/api/contributors/" + contributorId);
    // .then((response) => {
    //     console.log("deu bom", response);
    // })
    // .catch((e) => {
    //     console.error("deu ruim", e);
    // });
};
