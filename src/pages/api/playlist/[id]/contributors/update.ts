import { User } from "infra/models/playlist/Playlist";
import { TracksItem } from "infra/models/spotify/SpotifyPlaylist";
import { Track } from "infra/models/spotify/SpotifyTrack";
import { NextApiRequest, NextApiResponse } from "next";
import { getById } from "services/playlist";

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

    console.log({ id });

    if (!id) {
        res.status(400);
    }

    try {
        const playlist = await getById(id as string);

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

        res.status(200).send(contributors);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
};
