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
        const lastKeyId = req.query.lastPageEvaluated;
        const lastEvaluatedKey: DocumentClient.Key | undefined = lastKeyId
            ? {
                  id: lastKeyId,
              }
            : undefined;

        const {
            Items: playlists = [],
            LastEvaluatedKey,
            ...rest
        } = await getAll(lastEvaluatedKey);
        // let playlist = Items;

        // while (lastEvaluatedKey !== undefined) {
        //     const { Items = [], LastEvaluatedKey } = await getAll(
        //         lastEvaluatedKey
        //     );
        //     playlist = [...playlist, ...Items];
        //     lastEvaluatedKey = LastEvaluatedKey;
        //     console.log("previous.length", playlist.length, lastEvaluatedKey);
        // }

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
