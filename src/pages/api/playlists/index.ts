import Redis from "ioredis";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getCurrentPlaylist, getPlaylists } from "../../../services/spotify";

/**
 * get current playing music
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") {
        res.statusCode = 405;
        res.end();
        return;
    }

    const { limit = 25, offset = 0 } = req.query;

    try {
        const redis = new Redis(process.env.REDIS_AUTH);
        await redis.ping("hello");

        let token = await redis.get("playOnze");

        console.log(1, { token });

        if (!token) {
            console.log("replay");
            await axios.get(`${process.env.PUBLIC_URL}/api/replay`);
            token = await redis.get("playOnze");
            redis.disconnect();
        }

        console.log(2, { token });

        const [playlists, current] = await Promise.all([
            getPlaylists({
                token: token!,
                limit: Number(limit),
                offset: Number(offset),
            }),
            getCurrentPlaylist({
                token: token!,
            }),
        ]);

        res.status(200).send({
            current,
            previous: playlists.items.filter((item) =>
                item.name.includes("Tá Onze! Vol.")
            ),
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({});
    }
};
