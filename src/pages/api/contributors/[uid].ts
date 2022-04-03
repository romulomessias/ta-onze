import axios from "axios";

import { NextApiRequest, NextApiResponse } from "next";
import { tokenKey } from "infra/constants/redis";
import { getByToken } from "services/general";
import { getContributorProfile as getContributorSpotifyProfile } from "services/spotify";

import { addContributor, getContributorProfile } from "services/contributors";

const postContributor = async (res: NextApiResponse, uid: string) => {
    try {
        let token = await getByToken(tokenKey);

        if (!token) {
            console.log("ops");
            const response = await axios.get(
                `${process.env.PUBLIC_URL}/api/replay`
            );
            token = response.data.token;
        }

        let profile = await await getContributorProfile(uid);

        if (!profile) {
            console.log("addProfile");
            profile = await getContributorSpotifyProfile(uid, token.value);
            addContributor(profile);
        }

        res.status(201).send(profile);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
};

const getContributor = async (res: NextApiResponse, uid: string) => {
    try {
        let token = await getByToken(tokenKey);

        if (!token) {
            const response = await axios.get(
                `${process.env.PUBLIC_URL}/api/replay`
            );
            token = response.data.token;
        }

        const profile = await getContributorProfile(uid);
        console.log({ profile });

        if (profile) {
            res.status(200).send({ profile });
        } else {
            res.status(404).send(`profile for ${uid} was not found`);
        }
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
};

/**
 * get current playing music
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { uid } = req.query;

    console.log({ uid });

    if (!uid) {
        res.status(400);
    }

    if (req.method === "POST") {
        console.log("POST", uid);
        await postContributor(res, uid as string);
    } else if (req.method === "GET") {
        console.log("GET", uid);
        await getContributor(res, uid as string);
    } else {
        res.statusCode = 405;
        return;
    }
};
