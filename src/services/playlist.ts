import dynamoClient from "../../lib/dynamodb";

export function create(item: any) {
    return dynamoClient.put({
        TableName: process.env.AWS_DYNAMO_TABLE_NAME,
        Item: item,
    });
}

export async function getAll() {
    const { Items = [] } = await dynamoClient.getAll({
        TableName: process.env.AWS_DYNAMO_TABLE_NAME,
    });

    return Items;
}
