import { HighlightPlaylist } from "./../../../../infra/models/playlist/Playlist";
import { tokenKey } from "../../../../infra/constants/redis";
import Redis from "ioredis";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getCurrentPlaylist, getPlaylist } from "../../../../services/spotify";

import { PlaylistItem } from "../../../../infra/models/spotify/SpotifyPlaylist";

const mapHighlightedPlaylist = (
    playlist: PlaylistItem,
    description: string
): HighlightPlaylist => {
    const { tracks, images, external_urls } = playlist;
    const [image] = images;

    return {
        name: playlist.name,
        imageUrl: image?.url,
        description,
        tracks,
        spotifyUrl: external_urls.spotify,
    };
};

/**
 * get current playing music
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

        let token = await redis.get(tokenKey);

        if (!token) {
            await axios.get(`${process.env.PUBLIC_URL}/api/replay`);
            token = await redis.get(tokenKey);
            redis.disconnect();
        }

        const highlightedPlaylists = await Promise.all([
            getCurrentPlaylist({
                token: token!,
            }),
            getPlaylist({
                token: token!,
                id: "3Pl7107XuONQ1CsQuzafeQ",
            }),
        ]);

        const [current, other] = highlightedPlaylists;

        res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate");
        res.status(200).send({
            current,
            highlighted: [
                mapHighlightedPlaylist(
                    other,
                    "Essa é uma playlist livre e colaborativa."
                ),
                mapHighlightedPlaylist(
                    current,
                    "A playlist quinzenal do time mais badalado da <strong>RV</strong>"
                ),
            ],
        });
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
};
