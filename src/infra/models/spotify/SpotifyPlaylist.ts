import {
    ExternalUrls,
    Image,
    VideoThumbnail,
} from "infra/models/spotify/common";
import { TrackDetail } from "infra/models/spotify/SpotifyTrack";

export interface PlaylistRequestParams {
    token: string;
    limit?: number;
    offset?: number;
    id?: string;
    ownerId?: string;
}

export interface PlaylistsResponse {
    href: string;
    items: PlaylistItem[];
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
}

export interface PlaylistItem {
    collaborative: boolean;
    description: string;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    images: Image[];
    name: string;
    owner: Owner;
    primary_color: null;
    public: boolean;
    snapshot_id: string;
    tracks: Tracks;
    type: string;
    uri: string;
}

export interface Owner {
    display_name: string;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    type: string;
    uri: string;
}

export interface Tracks {
    href: string;
    items: TracksItem[];
    limit: number;
    next: null | string;
    offset: number;
    previous: null | string;
    total: number;
}

export interface TracksItem {
    added_at: Date;
    added_by: Owner;
    is_local?: boolean;
    primary_color?: null;
    track: TrackDetail;
    video_thumbnail?: VideoThumbnail;
}
