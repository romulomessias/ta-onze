// import { TracksItem } from "./../spotify/SpotifyPlaylist";

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

export interface TracksItem {
    added_at:        Date;
    added_by:        User;
    is_local?:        boolean;
    primary_color?:   null;
    track:           TrackDetail;
}

export interface TrackDetail {
    album: Album;
    artists: Artist[];
    disc_number?: number;
    duration_ms: number;
    explicit?: boolean;
    // external_ids: ExternalIDS;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    is_local?: boolean;
    is_playable?: boolean;
    name: string;
    popularity: number;
    preview_url: string;
    track_number?: number;
    type?: string;
    uri?: string;
    available_markets?: string[];
    episode?: boolean;
    track?: boolean;
}


export interface Album {
    available_markets?: Array<string>;
    album_type?: string;
    artists: Artist[];
    external_urls?: ExternalUrls;
    href?: string;
    id: string;
    images?: Image[];
    name: string;
    release_date?: Date;
    release_date_precision?: string;
    total_tracks?: number;
    type?: string;
    uri?: string;
}
export interface Artist {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
}

export interface ExternalUrls {
    spotify: string;
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
