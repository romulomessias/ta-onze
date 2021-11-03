import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { refreshTokenKey, tokenKey } from "../../../infra/constants/redis";
import { SpotifyToken } from "../../../infra/models/spotify/SpotifyToken";
import { updateSpotifyToken } from "../../../services/general";
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
            updateSpotifyToken({
                key: tokenKey,
                value: token.play,
                timeToLive: Math.floor(Date.now() / 1000) + token.time,
            });

            updateSpotifyToken({
                key: refreshTokenKey,
                value: token.play,
            });

            res.setHeader(
                "Set-Cookie",
                cookie.serialize("play", token.play, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    maxAge: token.time,
                    sameSite: "strict",
                    path: "/spotiplay",
                })
            );
            res.redirect(`${process.env.PUBLIC_URL}/spotiplay`);
        }
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
};
