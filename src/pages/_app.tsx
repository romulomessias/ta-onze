import { FC, useEffect, useState } from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import FelaProvider, { FelaProviderProps } from "styles/FelaProvider";
import PageLoading from "components/miscellaneous/PageLoading";

export type IAppProps = AppProps & FelaProviderProps;

const App: FC<IAppProps> = ({ Component, pageProps, renderer }) => {
    const router = useRouter();

    const [pageLoadingStatus, setPageLoadingStatus] = useState("default");

    useEffect(() => {
        const handleStart = () => setPageLoadingStatus("loading");

        const handleComplete = () => {
            setPageLoadingStatus("loaded");
        };

        router.events.on("routeChangeStart", handleStart);
        router.events.on("routeChangeComplete", handleComplete);
        router.events.on("routeChangeError", handleComplete);

        return () => {
            router.events.off("routeChangeStart", handleStart);
            router.events.off("routeChangeComplete", handleComplete);
            router.events.off("routeChangeError", handleComplete);
        };
    });

    return (
        <>
            <Head>
                <title>Tá Onze!</title>
                <link rel="shortcut icon" href="/logo.jpeg" />
                <link rel="manifest" href="/manifest.json" />
                <link rel="apple-touch-icon" href="/logo.jpeg" />
                <meta name="theme-color" content="#124666" />
                <meta
                    name="viewport"
                    content="initial-scale=1.0, width=device-width"
                />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;500;700&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <FelaProvider renderer={renderer}>
                <PageLoading status={pageLoadingStatus} />
                <Component {...pageProps} />
            </FelaProvider>
        </>
    );
};

export default App;
