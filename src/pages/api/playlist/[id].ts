import { tokenKey } from "../../../infra/constants/redis";
import Redis from "ioredis";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getPlaylist } from "../../../services/spotify";
import { getAll, getById } from "../../../services/playlist";

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
        // const redis = new Redis(process.env.REDIS_AUTH);
        // await redis.ping("hello");

        // let token = await redis.get(tokenKey);

        // if (!token) {
        //     await axios.get(`${process.env.PUBLIC_URL}/api/replay`);
        //     token = await redis.get(tokenKey);
        //     redis.disconnect();
        // }

        const playlist = await getById(id as string);

        res.status(200).send(playlist);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
};
