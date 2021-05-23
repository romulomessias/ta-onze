import { Tracks } from "./../../../../../infra/models/spotify/SpotifyPlaylist";
import { getPlaylist } from "./../../../../../services/spotify";
import { tokenKey } from "./../../../../../infra/constants/redis";
import axios, { AxiosRequestConfig } from "axios";
import Redis from "ioredis";
import { NextApiRequest, NextApiResponse } from "next";
import { updateTracks } from "../../../../../services/playlist";

/**
 * get token
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "PUT") {
        res.statusCode = 405;
        res.end();
        return;
    }

    const { id } = req.query;

    if (!id) {
        res.status(404);
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

        const config: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };

        const [spotifyPlaylist] = await Promise.all([
            getPlaylist({
                token: token!,
                id: id as string,
            }),
        ]);

        let next: string | null = spotifyPlaylist.tracks.next;
        let tracks = spotifyPlaylist.tracks.items;

        while (next) {
            const { data: currentTracks } = await axios.get<Tracks>(
                next!,
                config
            );
            tracks = [...tracks, ...currentTracks.items];
            next = currentTracks.next;
        }

        await updateTracks(id as string, tracks);

        res.status(201).send({ tracks });
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
};
