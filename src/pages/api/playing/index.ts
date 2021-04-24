import { Track } from "../../../infra/spotify/SpotifyTrack";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import Redis from "ioredis";

const getCurrentTrackPlaying = async (token: string): Promise<Track> => {
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    params: {
      market: "ES",
    },
  };

  try {
    const { data } = await axios.get<Track>(
      "https://api.spotify.com/v1/me/player/currently-playing",
      config
    );

    return data;
  } catch (e) {
    console.error("cound not get track");
    throw e;
  }
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
    const redis = new Redis(process.env.REDIS_AUTH);
    await redis.ping("hello");

    let token = await redis.get("play");

    if (!token) {
      await axios.get(`${process.env.PUBLIC_URL}/api/replay`);
      token = (await redis.get("play")) ?? "";
      redis.disconnect()
    }

    const track = await getCurrentTrackPlaying(token);
    res.status(201).send(track);
  } catch (e) {
    console.log(e)
    res.status(500).send({});
  }
};
