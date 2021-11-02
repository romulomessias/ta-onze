import dynamoClient from "./dynamodb";

const TableName = "TaOnzeInfo";

interface Token {
    Key: string;
    Value: string;
    TimeToLive?: number;
}

export const updateSpotifyToken = (token: Token) => {
    return dynamoClient.put({
        TableName,
        Item: token,
    });
};

export async function getByToken(token: string) {
    const { Item } = await dynamoClient.get({
        TableName,
        Key: {
            Key: token,
        },
    });

    return Item as Token;
}
