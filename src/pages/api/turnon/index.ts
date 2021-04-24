import { NextApiRequest, NextApiResponse } from "next";

/**
 * get access code to login at spotify
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") {
        res.statusCode = 405;
        res.end();
        return;
    }

    const scopes = [
        "user-read-currently-playing",
        "user-read-playback-position",
        "playlist-read-private",
        "playlist-read-collaborative",
    ];
    const params = [
        "response_type=code",
        `client_id=${process.env.SPOTIFY_CLIENT_ID}`,
        `redirect_uri=${process.env.PUBLIC_URL}/api/play`,
        `scope=${encodeURIComponent(scopes.join(" "))}`,
    ];

    console.log(
        "signin",
        params,
        "https://accounts.spotify.com/authorize?" + params.join("&")
    );

    const url = "https://accounts.spotify.com/authorize?" + params.join("&");

    res.writeHead(301, {
        Location: url,
    });
    res.end();
};
