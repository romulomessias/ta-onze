/// <reference types="node" />
/// <reference types="next" />
/// <reference types="next/types/global" />

declare namespace NodeJS {
    interface Process {
        browser: boolean;
    }

    interface ProcessEnv {
        NODE_ENV: "development" | "production";
        PUBLIC_URL: string;

        SPOTIFY_CLIENT_ID: string;
        SPOTIFY_SECRET_CLIENT_ID: string;

        REDIS_ACCESS: string;
        
        SLACK_CLIENT_ID: string;
    }
}
