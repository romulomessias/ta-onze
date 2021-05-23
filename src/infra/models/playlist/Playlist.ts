import { TracksItem } from "./../spotify/SpotifyPlaylist";

export interface Playlist {
    id: string;
    name: string;
    description: string;
    externalUrl: string;
    type: string;
    images: Image[];
    tracks: Tracks;
    createdAt?: number;
    genres: Genre[];
}

export interface Genre {
    name: string;
    popularity: number
}

export interface Tracks {
    items: TracksItem[];
    total: number;
}

export interface TrackItem {
    addedAt: Date;
    addedBy: User;
}

export interface User {
    id: string;
    name?: string;
}

export interface Image {
    height: number;
    url: string;
    width: number;
}
