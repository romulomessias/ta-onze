import { ExternalIDS, Image, ExternalUrls } from "./common";

export interface Track {
    timestamp: number;
    context: null;
    progress_ms: number;
    item: TrackDetail;
    currently_playing_type: string;
    actions: Actions;
    is_playing: boolean;
}

export interface Actions {
    disallows: Disallows;
}

export interface Disallows {
    resuming: boolean;
    skipping_prev: boolean;
}

export interface TrackDetail {
    album: Album;
    artists: Artist[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: ExternalIDS;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    is_local: boolean;
    is_playable: boolean;
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
    available_markets?: string[];
    episode?: boolean;
    track?: boolean;
}

export interface Album {
    album_type: string;
    artists: Artist[];
    external_urls: ExternalUrls;
    href: string;
    id: string;
    images: Image[];
    name: string;
    release_date: Date;
    release_date_precision: string;
    total_tracks: number;
    type: string;
    uri: string;
}

export interface Artist {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
}
