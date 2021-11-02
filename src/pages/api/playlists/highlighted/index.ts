import { HighlightPlaylist } from "./../../../../infra/models/playlist/Playlist";
import { tokenKey } from "../../../../infra/constants/redis";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getCurrentPlaylist, getPlaylist } from "../../../../services/spotify";

import { PlaylistItem } from "../../../../infra/models/spotify/SpotifyPlaylist";
import { getByToken } from "../../../../services/general";

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
        let token = await getByToken(tokenKey);

        if (!token) {
            token = await axios.get(`${process.env.PUBLIC_URL}/api/replay`);
        }

        const highlightedPlaylists = await Promise.all([
            getCurrentPlaylist({
                token: token!.Value,
            }),
            getPlaylist({
                token: token!.Value,
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
