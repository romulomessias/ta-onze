import { tokenKey } from "./../../../../../infra/constants/redis";
import axios, { AxiosRequestConfig } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import {
    getById,
    updatePlaylistGenres,
} from "../../../../../services/playlist";
import { getByToken } from "../../../../../services/general";

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
        let token = await getByToken(tokenKey);

        if (!token) {
            token = await axios.get(`${process.env.PUBLIC_URL}/api/replay`);
        }

        const config: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${token.Value}`,
                "Content-Type": "application/json",
            },
        };

        const playlist = await getById(id as string);

        const artistsLinks = playlist.tracks.items
            .flatMap((track) => track.track.artists)
            .map(({ href }) => href);

        const uniqueUrls = [...new Set(artistsLinks)];

        //todo: use some kind of queue here
        const artists: any[] = [];
        for (const url of uniqueUrls) {
            const { data } = await axios.get(url, config);
            artists.push(data);
        }

        const allGenres = artists.flatMap((it) => it.genres);
        const uniqueGenres = [...new Set(allGenres)];
        const genres = uniqueGenres
            .map((genre) => ({
                name: genre,
                popularity: allGenres.filter((it) => it === genre).length,
            }))
            .sort((a, b) => b.popularity - a.popularity);

        await updatePlaylistGenres(id as string, genres);

        res.status(204).send({genres});
    } catch (e) {
        console.log("deu erro", e);
        res.status(500).send(e);
    }
};
