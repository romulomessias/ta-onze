import axios, { AxiosRequestConfig } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

import { tokenKey } from "infra/constants/redis";
import { playlistName } from "infra/constants/spotify";
import { PlaylistItem, Tracks } from "infra/models/spotify/SpotifyPlaylist";
import { getPlaylist } from "services/spotify";
import { createPlaylist, updateTracks } from "services/playlist";
import { getCurrentPlaylist } from "services/spotify";
import {
    getByToken,
    getCurrentSprint,
    updateCurrentSprint,
} from "services/general";

/**
 * get token
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        res.statusCode = 405;
        res.end();
        return;
    }

    try {
        let token = await getByToken(tokenKey);

        if (!token) {
            const response = await axios.get(
                `${process.env.PUBLIC_URL}/api/replay`
            );
            token = response.data.token;
        }

        const currentSprint = await getCurrentSprint();
        const updatedSprint = currentSprint.value + 1;

        const userId = "12144153509";
        const createPlaylistPayload = {
            name: `${playlistName} Vol. ${updatedSprint}`,
            description: `Playlist da sprint ${updatedSprint}`,
            public: true,
        };

        const config: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${token.value}`,
                "Content-Type": "application/json",
            },
        };

        const currentPlaylist = await getCurrentPlaylist({
            token: token.value,
        });

        let next: string | null = currentPlaylist.tracks.next;
        let tracks = currentPlaylist.tracks.items;

        //create playlist
        const { data: newPlaylist } = await axios.post<PlaylistItem>(
            `https://api.spotify.com/v1/users/${userId}/playlists`,
            createPlaylistPayload,
            config
        );

        // add music
        const playlistTracks = tracks.map((it) => it.track.uri).join(",");
        await axios.post(
            `https://api.spotify.com/v1/playlists/${newPlaylist.id}/tracks?uris=` +
                playlistTracks,
            {},
            config
        );

        while (next) {
            console.log(`getting more: ${next}`);
            const { data: currentTracks } = await axios.get<Tracks>(
                next!,
                config
            );
            tracks = [...tracks, ...currentTracks.items];
            next = currentTracks.next;

            const morePlaylistTracks = currentTracks.items
                .map((it) => it.track.uri)
                .join(",");
            await axios.post(
                `https://api.spotify.com/v1/playlists/${newPlaylist.id}/tracks?uris=` +
                    morePlaylistTracks,
                {},
                config
            );
        }

        const updatedPlaylist = await getPlaylist({
            token: token.value,
            id: newPlaylist.id,
        });

        //save on dynamodb
        const playlistRes = await createPlaylist(updatedPlaylist);
        console.log("saved at dynamo", { playlistRes });
        await updateTracks(updatedPlaylist.id, tracks);

        // if (userId === currentPlaylist.owner.id) {
        //     const { data: deletedData } = await axios.delete(
        //         `https://api.spotify.com/v1/playlists/4U9wh76pT9tWARLR04bloA/tracks?`,
        //         {
        //             ...config,
        //             data: {
        //                 tracks: tracksToRemove,
        //             },
        //         }
        //     );
        // }

        await axios.get(
            `${process.env.PUBLIC_URL}/api/${updatedPlaylist.id}/contributors/process`
        );

        updateCurrentSprint(updatedSprint);
        res.status(201).send(updatedPlaylist);
    } catch (e) {
        res.status(500).send(e);
    }
};
