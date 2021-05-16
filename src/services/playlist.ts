import { Playlist } from './../infra/models/playlist/Playlist';
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


export const createPlaylist = (
    newPlaylist: PlaylistItem,
    tracks: TracksItem[]
) => {
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
    const playlist: Playlist = {
        id: newPlaylist.id,
        name: newPlaylist.name,
        description: newPlaylist.description,
        externalUrl: newPlaylist.external_urls.spotify,
        images: newPlaylist.images,
        type: newPlaylist.type,
        createdAt: Date.now(),
        tracks: {
            total: mapped.length,
            items: mapped,
        },
    };

    return dynamoClient.put({
        TableName: process.env.AWS_DYNAMO_TABLE_NAME,
        Item: playlist,
    });
};

export async function getAll() {
    const { Items = [] } = await dynamoClient.getAll({
        TableName: process.env.AWS_DYNAMO_TABLE_NAME,
    });

    return Items;
}
