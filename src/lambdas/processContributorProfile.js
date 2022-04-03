exports.handler = async (event, context) => {
    const [record] = event.Records;
    const { Id } = record.attributes;
    console.log({ record, Id });
    console.log("processContributorProfile");

    const response = {
        statusCode: 200,
        body: JSON.stringify(record),
    };
    return response;
};
