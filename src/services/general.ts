import { currentSprintKey } from "../infra/constants/redis";
import dynamoClient from "./dynamodb";

const TableName = "TaOnzeInfo";

interface Token {
    timeToLive?: number;
    key: string;
    value: string;
}

interface SprintNumber {
    key: string;
    value: number;
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
            key: token,
        },
    });

    return Item as Token;
}

export async function getCurrentSprint() {
    const { Item } = await dynamoClient.get({
        TableName,
        Key: {
            key: currentSprintKey,
        },
    });

    return Item as SprintNumber;
}

export async function updateCurrentSprint(value: number) {
    return dynamoClient.put({
        TableName,
        Item: {
            key: currentSprintKey,
            value: value,
        },
    });
}
