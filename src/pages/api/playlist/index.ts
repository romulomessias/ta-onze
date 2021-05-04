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

        let token = await redis.get("playOnze");
        if (!token) {
            await axios.get(`${process.env.PUBLIC_URL}/api/replay`);
            token = await redis.get("playOnze");
            redis.disconnect();
        }

        const currentSprint = await redis.get("currentSprint");
        redis.set("currentSprint", parseInt(currentSprint!) + 1);
        redis.disconnect();

        const userId = "12144153509";
        const createPlaylistPayload = {
            name: `Tá Onze! Vol. ${parseInt(currentSprint!) + 1}`,
            description: `Playlist da sprint ${parseInt(currentSprint!) + 1}`,
            public: true,
        };

        const config: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };

        //create playlist
        const { data } = await axios.post(
            `https://api.spotify.com/v1/users/${userId}/playlists`,
            createPlaylistPayload,
            config
        );

        const currentPlaylist = await getCurrentPlaylist({
            token: token!,
        });

        const tracksToAdd = currentPlaylist.tracks.items
            .map((it) => it.track.uri)
            .join(",");

        // add music
        const { data: newData } = await axios.post(
            `https://api.spotify.com/v1/playlists/${data.id}/tracks?uris=` +
                tracksToAdd,
            {},
            config
        );

        const tracksToRemove = currentPlaylist.tracks.items.map(
            (it, index) => ({
                uri: it.track.uri,
                positions: [index],
            })
        );

        const { data: deletedData } = await axios.delete(
            `https://api.spotify.com/v1/playlists/34iESXuSY8PzrCDS7pFkLu/tracks?`,
            {
                ...config,
                data: {
                    tracks: tracksToRemove,
                },
            }
        );
        console.log({ deletedData });
        //clear current playlist cec16e71faa64eb0

        res.status(201).send(newData);
    } catch (e) {
        console.log(e?.data);
        res.status(500).send(e);
    }
};
