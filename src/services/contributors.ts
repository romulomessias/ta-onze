import { SpotifyProfile } from "infra/models/spotify/SpotifyProfile";
import { dynamoClient } from "./aws";

const TableName = "TaOnzeContributors";

export const addContributor = (user: SpotifyProfile) => {
    return dynamoClient.put({
        TableName,
        Item: user,
    });
};

export async function getContributorProfile(id: string) {
    const { Item } = await dynamoClient.get({
        TableName,
        Key: {
            id,
        },
    });

    return Item as SpotifyProfile;
}
