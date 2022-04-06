/// <reference types="node" />

declare namespace NodeJS {
    interface Process {
        browser: boolean;
    }

    interface ProcessEnv {
        NODE_ENV: "development" | "production";
        PUBLIC_URL: string;

        SPOTIFY_CLIENT_ID: string;
        SPOTIFY_SECRET_CLIENT_ID: string;

        TAONZE_AWS_ACCESS_KEY_ID: string;
        TAONZE_AWS_SECRET_ACCESS_KEY: string;
        SPOTIFY_PLAYLIST_HOLDER_ID: string;
    }
}
