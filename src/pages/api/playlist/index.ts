import { getPlaylist } from "./../../../services/spotify";
import { createPlaylist, updateTracks } from "./../../../services/playlist";
import {
    PlaylistItem,
    Tracks,
} from "./../../../infra/models/spotify/SpotifyPlaylist";
import { playlistName } from "./../../../infra/constants/spotify";
import { tokenKey, currentSprintKey } from "./../../../infra/constants/redis";
import axios, { AxiosRequestConfig } from "axios";
import Redis from "ioredis";
import { NextApiRequest, NextApiResponse } from "next";
import { getCurrentPlaylist } from "../../../services/spotify";

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
        const redis = new Redis(process.env.REDIS_AUTH);
        await redis.ping("hello");

        let token = await redis.get(tokenKey);
        if (!token) {
            await axios.get(`${process.env.PUBLIC_URL}/api/replay`);
            token = await redis.get(tokenKey);
            redis.disconnect();
        }

        const currentSprint = await redis.get(currentSprintKey);
        redis.set(currentSprintKey, parseInt(currentSprint!) + 1);
        redis.disconnect();

        const userId = "12144153509";
        const createPlaylistPayload = {
            name: `${playlistName} Vol. ${parseInt(currentSprint!) + 1}`,
            description: `Playlist da sprint ${parseInt(currentSprint!) + 1}`,
            public: true,
        };

        const config: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };

        const currentPlaylist = await getCurrentPlaylist({
            token: token!,
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
            token: token!,
            id: newPlaylist.id,
        });

        //save on dynamodb
        createPlaylist(updatedPlaylist).then(async (res) => {
            console.log("saved at dynamo", res);
            await updateTracks(updatedPlaylist.id, tracks);
        });

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

        res.status(201).send(updatedPlaylist);
    } catch (e) {
        res.status(500).send(e);
    }
};
