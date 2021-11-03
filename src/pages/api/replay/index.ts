import { refreshTokenKey } from "./../../../infra/constants/redis";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { getByToken, updateSpotifyToken } from "../../../services/general";

const refreshToken = async (
    refresh_token: string
): Promise<{ play: string; time: number }> => {
    const secrets = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_SECRET_CLIENT_ID}`;
    const encoded = Buffer.from(secrets).toString("base64");
    const config = {
        headers: {
            Authorization: `Basic ${encoded}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };

    const data = [`refresh_token=${refresh_token}`, "grant_type=refresh_token"];

    const { data: token } = await axios.post<{
        access_token: string;
        expires_in: number;
    }>("https://accounts.spotify.com/api/token", data.join("&"), config);

    console.log({
        token,
    });

    return {
        play: token.access_token,
        time: token.expires_in,
    };
};

/**
 * get token from redis and refresh token if needed
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") {
        res.statusCode = 405;
        res.end();
        return;
    }

    try {
        const refresh = (await getByToken(refreshTokenKey))!;
        const token = await refreshToken(refresh.Value);

        const refreshedToken = {
            Key: "playOnze",
            Value: token.play,
            TimeToLive: Math.floor(Date.now() / 1000) + token.time,
        };

        updateSpotifyToken(refreshedToken);

        res.status(200).send({ toke: refreshedToken });
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
};
