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

        TAONZE_AWS_ACCESS_KEY_ID: string;
        TAONZE_AWS_SECRET_ACCESS_KEY: string;
        AWS_DYNAMO_TABLE_NAME: string;
    }
}
