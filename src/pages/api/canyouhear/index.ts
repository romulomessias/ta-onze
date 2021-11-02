import { tokenKey, refreshTokenKey } from "./../../../infra/constants/redis";
import { getSpotifyRefreshedToken } from "./../../../services/spotify";
import Redis from "ioredis";
import { NextApiRequest, NextApiResponse } from "next";
import { getByToken, updateSpotifyToken } from "../../../services/general";

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
        const token = await getByToken(tokenKey);

        if (token) {
            res.status(200).send({ hasPermission: true });
        } else {
            const refresh = (await getByToken(refreshTokenKey))!;

            if (!refresh) {
                throw "No refresh token";
            }

            const token = await getSpotifyRefreshedToken(refresh.Value);

            updateSpotifyToken({
                Key: tokenKey,
                Value: token.play,
                TimeToLive: Math.floor(Date.now() / 1000) + token.time,
            });

            res.status(200).send({ hasPermission: true });
        }
    } catch (e) {
        // console.log(e);
        res.status(200).send({ hasPermission: false, e });
    }
};
