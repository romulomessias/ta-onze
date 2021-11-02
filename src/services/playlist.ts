import { Playlist } from "./../infra/models/playlist/Playlist";
import {
    PlaylistItem,
    TracksItem,
} from "./../infra/models/spotify/SpotifyPlaylist";
import dynamoClient from "./dynamodb";
import { Key } from "aws-sdk/clients/dynamodb";

type omitKeys =
    | "available_markets"
    | "uri"
    | "is_local"
    | "explicit"
    | "episode";

const defaultTableName = "TaOnze";

export const createPlaylist = (
    newPlaylist: PlaylistItem,
    TableName: string = defaultTableName
) => {
    const playlist: Playlist = {
        id: newPlaylist.id,
        name: newPlaylist.name,
        description: newPlaylist.description,
        externalUrl: newPlaylist.external_urls.spotify,
        images: newPlaylist.images,
        type: newPlaylist.type,
        createdAt: Date.now(),
        tracks: { ...newPlaylist.tracks },
        genres: [],
    };

    return dynamoClient.put({
        TableName,
        Item: playlist,
    });
};

export async function getAll(
    exclusiveStartKey?: Key,
    TableName: string = defaultTableName
) {
    console.log(TableName, exclusiveStartKey);
    const result = await dynamoClient.getAll({
        TableName,
        ExclusiveStartKey: exclusiveStartKey,
    });

    return result;
}

export async function getById(
    id: string,
    TableName: string = defaultTableName
) {
    const { Item } = await dynamoClient.get({
        TableName,
        Key: {
            id,
        },
    });

    return Item as Playlist;
}

export async function updateTracks(
    id: string,
    tracks: TracksItem[],
    TableName: string = defaultTableName
) {
    const mapped = tracks.map((it) => {
        const { primary_color, video_thumbnail, is_local, ...rest } = it;
        const {
            available_markets,
            external_urls,
            images,
            type,
            uri,
            total_tracks,
            album_type,
            ...omittedAlbum
        } = it.track.album;
        const {
            available_markets: trackAvailableMarket,
            disc_number,
            episode,
            explicit,
            is_local: trackIsLocal,
            track_number,
            type: trackType,
            uri: trackUri,
            ...track
        } = it.track;

        const omitted: Omit<TracksItem, omitKeys> = {
            ...rest,
            track: { ...track, album: omittedAlbum },
        };
        return omitted;
    });

    return dynamoClient.update({
        TableName,
        Key: {
            id,
        },
        UpdateExpression: "set tracks.#trackItems = :newTracks",
        ExpressionAttributeNames: {
            "#trackItems": "items",
        },
        ExpressionAttributeValues: {
            ":newTracks": mapped,
        },
    });
}

export async function updatePlaylistGenres(
    id: string,
    genres: object[],
    TableName: string = defaultTableName
) {
    return dynamoClient.update({
        TableName,
        Key: {
            id,
        },
        UpdateExpression: "set genres = :genres",
        ExpressionAttributeValues: {
            ":genres": genres,
        },
    });
}
