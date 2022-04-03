import axios, { AxiosRequestConfig } from "axios";

import {
    PlaylistItem,
    PlaylistRequestParams,
    PlaylistsResponse,
} from "../infra/models/spotify/SpotifyPlaylist";
import { SpotifyToken } from "../infra/models/spotify/SpotifyToken";
import { SpotifyProfile } from "infra/models/spotify/SpotifyProfile";

export const getSpotifyToken = async (code: string): Promise<SpotifyToken> => {
    const secrets = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_SECRET_CLIENT_ID}`;
    const encoded = Buffer.from(secrets).toString("base64");

    const config = {
        headers: {
            Authorization: `Basic ${encoded}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };

    const data = [
        "grant_type=authorization_code",
        `code=${code}`,
        `redirect_uri=${process.env.PUBLIC_URL}/api/play`,
    ];

    const result = await axios.post(
        "https://accounts.spotify.com/api/token",
        data.join("&"),
        config
    );

    return {
        play: result.data.access_token,
        replay: result.data.refresh_token,
        time: result.data.expires_in,
    };
};

export const getSpotifyRefreshedToken = async (
    refresh_token: string
): Promise<SpotifyToken> => {
    const secrets = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_SECRET_CLIENT_ID}`;
    const encoded = Buffer.from(secrets).toString("base64");
    const config = {
        headers: {
            Authorization: `Basic ${encoded}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };

    const data = [`refresh_token=${refresh_token}`, "grant_type=refresh_token"];

    const result = await axios.post(
        "https://accounts.spotify.com/api/token",
        data.join("&"),
        config
    );

    return {
        play: result.data.access_token,
        time: result.data.expires_in,
    };
};

export const getCurrentPlaylist = async (
    params: PlaylistRequestParams
): Promise<PlaylistItem> => {
    return getPlaylist({ ...params, id: "34iESXuSY8PzrCDS7pFkLu" });
};

export const getPlaylist = async (
    params: PlaylistRequestParams
): Promise<PlaylistItem> => {
    const { token, id } = params;
    const config: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    try {
        const { data } = await axios.get<PlaylistItem>(
            "https://api.spotify.com/v1/playlists/" + id,
            config
        );

        return data;
    } catch (e) {
        console.error("cound not get playlist", params);
        console.error(e);
        throw e;
    }
};

export const getPlaylists = async (
    params: PlaylistRequestParams
): Promise<PlaylistsResponse> => {
    const { token, limit = 20, offset = 0 } = params;
    const config: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        params: {
            limit,
            offset,
        },
    };

    try {
        const { data } = await axios.get<PlaylistsResponse>(
            "https://api.spotify.com/v1/me/playlists",
            config
        );

        return data;
    } catch (e) {
        console.error("cound not get playlists");
        throw e;
    }
};

export const getContributorProfile = async (
    uid: string,
    token: string
): Promise<SpotifyProfile> => {
    const config: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };

    try {
        console.log("https://api.spotify.com/v1/users/" + uid);
        const { data } = await axios.get(
            "https://api.spotify.com/v1/users/" + uid,
            config
        );

        return data;
    } catch (e) {
        console.error("cound not get user profile");
        console.error(e);
        throw e;
    }
};
