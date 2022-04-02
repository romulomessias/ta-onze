import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

import { HighlightPlaylist } from "infra/models/playlist/Playlist";
import { tokenKey } from "infra/constants/redis";
import { PlaylistItem } from "infra/models/spotify/SpotifyPlaylist";
import { getCurrentPlaylist, getPlaylist } from "services/spotify";
import { getByToken } from "services/general";

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

        const currentDate = new Date();
        const tokenTTL = new Date(Date.now() + token.timeToLive!);


        if (!token ) {
            console.log("ops", { token });
            const response = await axios.get(
                `${process.env.PUBLIC_URL}/api/replay`
            );
            token = response.data.token;

            console.log("ow", { updated: response.data.token });
        }

        const highlightedPlaylists = await Promise.all([
            getCurrentPlaylist({
                token: token.value,
            }),
            getPlaylist({
                token: token.value,
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
        // console.log(e);
        res.status(500).send(e);
    }
};
