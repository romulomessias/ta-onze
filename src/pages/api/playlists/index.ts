import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { NextApiRequest, NextApiResponse } from "next";
import { getAll } from "services/playlist";

/**
 * get previous playlist
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") {
        res.statusCode = 405;
        res.end();
        return;
    }

    try {
        const { lastPageEvaluated: id } = req.query;
        const lastEvaluatedKey: DocumentClient.Key | undefined = id
            ? {
                  id,
              }
            : undefined;

        const { Items: playlists = [], LastEvaluatedKey } = await getAll(
            lastEvaluatedKey
        );

        res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate");
        res.status(200).send({
            playlists,
            lastPageEvaluated: LastEvaluatedKey?.id,
        });
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
};
