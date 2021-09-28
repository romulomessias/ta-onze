import { NextApiRequest, NextApiResponse } from "next";
import { getAll } from "../../../../services/playlist";

/**
 * get current playing music
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") {
        res.statusCode = 405;
        res.end();
        return;
    }

    try {
        const {
            Items = [],
            LastEvaluatedKey,
        } = await getAll();
        let previous = Items;
        let lastEvaluatedKey = LastEvaluatedKey;

        while (lastEvaluatedKey !== undefined) {
            const { Items = [], LastEvaluatedKey } = await getAll(
                lastEvaluatedKey
            );
            previous = [...previous, ...Items];
            lastEvaluatedKey = LastEvaluatedKey;
            console.log("previous.length", previous.length, lastEvaluatedKey);
        }

        res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate");
        res.status(200).send({
            previous,
        });
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
};
