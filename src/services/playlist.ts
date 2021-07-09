import { Playlist } from "./../infra/models/playlist/Playlist";
import {
    PlaylistItem,
    TracksItem,
} from "./../infra/models/spotify/SpotifyPlaylist";
import dynamoClient from "../../lib/dynamodb";

type omitKeys =
    | "available_markets"
    | "uri"
    | "is_local"
    | "explicit"
    | "episode";

const TableName = process.env.AWS_DYNAMO_TABLE_NAME ?? ''

export const createPlaylist = (newPlaylist: PlaylistItem) => {
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

export async function getAll() {
    const { Items = [] } = await dynamoClient.getAll({
        TableName,
    });

    return Items;
}

export async function getById(id: string) {
    const { Item } = await dynamoClient.get({
        TableName,
        Key: {
            id,
        },
    });

    return Item as Playlist;
}

export async function updateTracks(id: string, tracks: TracksItem[]) {
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

export async function updatePlaylistGenres(id: string, genres: object[]) {
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
