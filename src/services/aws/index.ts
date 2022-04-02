import aws from "aws-sdk";

aws.config.update({
    accessKeyId: process.env.TAONZE_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.TAONZE_AWS_SECRET_ACCESS_KEY,
});


export { default as dynamoClient } from './dynamodb'
export { default as sqsClient } from './sqs'