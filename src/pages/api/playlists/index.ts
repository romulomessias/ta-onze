import { playlistName } from "./../../../infra/constants/spotify";
import { tokenKey } from "./../../../infra/constants/redis";
import Redis from "ioredis";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getCurrentPlaylist, getPlaylists } from "../../../services/spotify";
import { getAll } from "../../../services/playlist";

/**
 * get current playing music
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") {
        res.statusCode = 405;
        res.end();
        return;
    }

    // const { limit = 25, offset = 0 } = req.query;

    try {
        const redis = new Redis(process.env.REDIS_AUTH);
        await redis.ping("hello");

        let token = await redis.get(tokenKey);

        if (!token) {
            await axios.get(`${process.env.PUBLIC_URL}/api/replay`);
            token = await redis.get(tokenKey);
            redis.disconnect();
        }

        const [current, previous] = await Promise.all([
            getCurrentPlaylist({
                token: token!,
            }),
            getAll(),
        ]);

        res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
        res.status(200).send({
            current,
            previous,
        });
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
};
