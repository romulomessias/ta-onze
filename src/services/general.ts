import { currentSprintKey } from "../infra/constants/redis";
import dynamoClient from "./dynamodb";

const TableName = "TaOnzeInfo";

interface Token {
    TimeToLive?: number;
    Key: string;
    Value: string;
}

interface SprintNumber {
    Key: string;
    Value: number;
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

export async function getCurrentSprint() {
    const { Item } = await dynamoClient.get({
        TableName,
        Key: {
            Key: currentSprintKey,
        },
    });

    return Item as SprintNumber;
}

export async function updateCurrentSprint(value: number) {
    return dynamoClient.put({
        TableName,
        Item: {
            Key: currentSprintKey,
            Value: value,
        },
    });
}
