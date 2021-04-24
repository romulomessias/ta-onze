import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import Redis from "ioredis";
import { SpotifyToken } from "../../../infra/spotify/SpotifyToken";

const getSpotifyToken = async (code: string): Promise<SpotifyToken> => {
    const secrets = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_SECRET_CLIENT_ID}`;
    const encoded = Buffer.from(secrets).toString("base64");

    const config = {
        headers: {
            Authorization: `Basic ${encoded}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };

    const data = [
        "grant_type=authorization_code",
        `code=${code}`,
        `redirect_uri=${process.env.PUBLIC_URL}/api/play`,
    ];

    const result = await axios.post(
        "https://accounts.spotify.com/api/token",
        data.join("&"),
        config
    );

    return {
        play: result.data.access_token,
        replay: result.data.refresh_token,
        time: result.data.expires_in,
    };
};

/**
 * get token
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") {
        res.statusCode = 405;
        res.end();
        return;
    }

    // const { code } = req.body;
    const { code } = req.query;

    if (code === undefined) {
        res.send("to bad");
        return;
    }

    const token = await getSpotifyToken(code as string);
    try {
        console.log(token);
    } catch (e) {
        console.error("nao deu pr apegar o token meu");
        console.error(e?.data);
    }

    try {
        console.log("code:", code);
        const redis = new Redis(process.env.REDIS_AUTH);
        await redis.ping("hello");
        const redisResponse = redis
            .multi()
            .set("play", token.play, "EX", token.time)
            .set("replay", token.replay!)
            .exec();
        redis.disconnect();
        console.log(redisResponse);
    } catch (e) {
        console.log(e);
    } finally {
        res.redirect(`${process.env.PUBLIC_URL}/spotiplay`);
    }
};
