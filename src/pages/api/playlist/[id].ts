import { NextApiRequest, NextApiResponse } from "next";
import { getById } from "services/playlist";

/**
 * get current playing music
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") {
        res.statusCode = 405;
        res.end();
        return;
    }
    const { id } = req.query;

    if (!id) {
        res.status(400);
    }

    try {
        const playlist = await getById(id as string);

        res.status(200).send(playlist);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
};
