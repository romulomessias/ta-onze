import axios from "axios";

import { Playlist, User } from "infra/models/playlist/Playlist";
import { NextApiRequest, NextApiResponse } from "next";
import { getById } from "services/playlist";
import { tokenKey } from "infra/constants/redis";
import { getByToken } from "services/general";
import { sqsClient } from "services/aws";

const getContributors = (playlist: Playlist) => {
    const contributors = playlist.tracks.items.reduce<User[]>(
        (uniqueContributors, track) => {
            const contributor = uniqueContributors.find(
                ({ id }) => id === track.added_by.id
            );

            const currentUniqueContributors: User[] = contributor
                ? [...uniqueContributors]
                : [...uniqueContributors, track.added_by];
            return currentUniqueContributors;
        },
        []
    );

    return contributors;
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
    const { id } = req.query;

    if (!id) {
        res.status(400);
    }

    try {
        let token = await getByToken(tokenKey);

        if (!token) {
            console.log("ops");
            const response = await axios.get(
                `${process.env.PUBLIC_URL}/api/replay`
            );
            token = response.data.token;
        }

        const playlist = await getById(id as string);
        const contributors = getContributors(playlist);

        contributors.forEach((contributor) =>
            sqsClient.addContributorToQueue(contributor)
        );

        res.status(200).send({
            message: "process finished",
            contributors: contributors.map((item) => item.id),
        });
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
};
