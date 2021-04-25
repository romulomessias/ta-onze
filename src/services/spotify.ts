import {
    PlaylistItem,
    PlaylistRequestParams,
    PlaylistsResponse,
} from "./../infra/spotify/SpotifyPlaylist";
import axios, { AxiosRequestConfig } from "axios";
import { SpotifyToken } from "../infra/spotify/SpotifyToken";

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
    const { token } = params;
    const config: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    try {
        const { data } = await axios.get<PlaylistItem>(
            "https://api.spotify.com/v1/playlists/34iESXuSY8PzrCDS7pFkLu",
            config
        );

        return data;
    } catch (e) {
        console.error("cound not get playlists");
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
