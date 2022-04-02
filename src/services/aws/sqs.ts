import SQS from "aws-sdk/clients/sqs";
import { User } from "infra/models/playlist/Playlist";

const client = new SQS({
    region: "us-east-1",
    apiVersion: "2012-11-05",
});

const addContributorToQueue = (contributor: User) => {
    var params = {
        MessageAttributes: {
            Id: {
                DataType: "String",
                StringValue: contributor.id,
            },
        },
        MessageBody: `Add contributor ${
            contributor.id
        } to database on ${new Date()}`,
        MessageDeduplicationId: contributor.id, // Required for FIFO queues
        MessageGroupId: contributor.id, // Required for FIFO queues
        QueueUrl:
            "https://sqs.us-east-1.amazonaws.com/503036362866/TaOnzeUpdateContributorsQueue.fifo",
    };

    client.sendMessage(params, (err, data) => {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data.MessageId);
        }
    });
};

const sqsClient = {
    addContributorToQueue,
};
export default sqsClient;
