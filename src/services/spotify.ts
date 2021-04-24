import axios from "axios";
import { SpotifyToken } from "../infra/spotify/SpotifyToken";

export const getSpotifyRefreshedToken = async (
    refresh_token: string
): Promise<SpotifyToken> => {
    const secrets = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_SECRET_CLIENT_ID}`;
    const encoded = Buffer.from(secrets).toString("base64");
    const config = {
        headers: {
            Authorization: `Basic ${encoded}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };

    const data = [`refresh_token=${refresh_token}`, "grant_type=refresh_token"];

    const result = await axios.post(
        "https://accounts.spotify.com/api/token",
        data.join("&"),
        config
    );

    return {
        play: result.data.access_token,
        time: result.data.expires_in,
    };
};
