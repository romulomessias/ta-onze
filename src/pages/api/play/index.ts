import { tokenKey, refreshTokenKey } from './../../../infra/constants/redis';
import Redis from "ioredis";
import { NextApiRequest, NextApiResponse } from "next";
import { SpotifyToken } from "../../../infra/models/spotify/SpotifyToken";
import { getSpotifyToken } from "./../../../services/spotify";

/**
 * get token
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") {
        res.statusCode = 405;
        res.end();
        return;
    }

    const { code } = req.query;

    if (code === undefined) {
        res.send("to bad");
        return;
    }

    let token: SpotifyToken | undefined;
    try {
        token = await getSpotifyToken(code as string);
    } catch (e) {
        console.error("nao deu pra pegar o token meu");
        console.error(e?.data);
        res.redirect(`${process.env.PUBLIC_URL}/spotiplay`);
    }

    try {
        if (token) {
            const redis = new Redis(process.env.REDIS_AUTH);
            await redis.ping("hello");

            await redis
                .multi()
                .set(tokenKey, token.play, "EX", token.time)
                .set(refreshTokenKey, token.replay!)
                .exec();
            redis.disconnect();
            res.redirect(`${process.env.PUBLIC_URL}/spotiplay`);
        }
    } catch (e) {
        console.log(e);
    }
};