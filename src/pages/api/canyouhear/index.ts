import { tokenKey, refreshTokenKey } from './../../../infra/constants/redis';
import { getSpotifyRefreshedToken } from "./../../../services/spotify";
import Redis from "ioredis";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * get token from redis
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") {
        res.statusCode = 405;
        res.end();
        return;
    }

    try {
        const redis = new Redis(process.env.REDIS_AUTH);
        await redis.ping("hello");

        const token = await redis.get(tokenKey);

        if (token) {
            res.status(200).send({ hasPermission: true });
        } else {
            const refresh = (await redis.get(refreshTokenKey))!;

            if (!refresh) {
                throw "No refresh token";
            }

            const token = await getSpotifyRefreshedToken(refresh);
            redis.set(tokenKey, token.play, "EX", token.time);
            redis.disconnect();
            res.status(200).send({ hasPermission: true });
        }
    } catch (e) {
        // console.log(e);
        res.status(200).send({ hasPermission: false });
    }
};
