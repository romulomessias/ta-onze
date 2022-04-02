import { ExternalUrls, Image } from "./common";

export interface SpotifyProfile {
    display_name: string;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    images: Image[];
    uri: string;
}
