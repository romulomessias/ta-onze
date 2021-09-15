import { tokenKey } from "../../../../infra/constants/redis";
import Redis from "ioredis";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getCurrentPlaylist, getPlaylist } from "../../../../services/spotify";
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
        const previous = await getAll();

        res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate");
        res.status(200).send({
            previous,
        });
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
};
