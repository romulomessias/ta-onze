import axios from "axios";
import { GetServerSideProps } from "next";
import { FC, useEffect, useState } from "react";
import { StyleFunction, useFela } from "react-fela";
import { IF } from "../components/layouts/Condition";

import Container from "../components/layouts/Container";
import Layout from "../components/layouts/Layout";
import Playlist from "../components/playlists/Playlist";
import PlaylistHero from "../components/playlists/PlaylistHero";
import Typography from "../components/typographies/Typography";
import {
    HighlightPlaylist,
    Playlist as PlaylistModel,
} from "../infra/models/playlist/Playlist";
import { PlaylistItem } from "../infra/models/spotify/SpotifyPlaylist";
import { Theme } from "../styles/Theme";
import Carousel, { autoplayPlugin } from "@brainhubeu/react-carousel";
import "@brainhubeu/react-carousel/lib/style.css";

const highlightedPlaylist: StyleFunction<Theme> = () => ({
    width: "100%",
});

const heroRules: StyleFunction<Theme> = ({ theme }) => ({
    backgroundColor: theme.pallette.navy30,
});

const layoutRules: StyleFunction<Theme> = () => ({
    paddingBottom: "calc(20px + env(safe-area-inset-bottom))",
});

const listRules: StyleFunction<Theme> = () => ({
    display: "grid",
    gridAutoFlow: "row",
    gap: 16,
});

interface IndexProps {
    current: PlaylistItem;
    previous: PlaylistModel[];
    highlighted: HighlightPlaylist[];
}

interface HighlightProps {
    playlist: HighlightPlaylist;
}

const HighlightedPlaylist: FC<HighlightProps> = ({ playlist }) => {
    const { css } = useFela<Theme>();
    const handleHeroButtonClick = () => {
        if (!playlist) {
            alert("Sorry! Não deu pra abrir a playlist :(");
        }
        const a = document.createElement("a");
        a.href = playlist.spotifyUrl;
        a.target = "_black";

        a.click();
    };
    return (
        <PlaylistHero
            className={css(highlightedPlaylist)}
            logoUrl={playlist.imageUrl}
            primaryButtonAction={handleHeroButtonClick}
            primaryButtonLabel="Abrir no spotify"
        >
            <Typography as="h1" variant="headline1">
                {playlist.name}
            </Typography>
            <Typography as="p" variant="subtitle" weight={300}>
                <span
                    dangerouslySetInnerHTML={{ __html: playlist.description }}
                />
            </Typography>

            <Typography as="p" weight={300}>
                com <strong>{playlist.tracks.total}</strong> músicas
            </Typography>
        </PlaylistHero>
    );
};

export default function Index({ previous = [], highlighted = [] }: IndexProps) {
    const { css } = useFela<Theme>();
    const [didMount, setDidMount] = useState(false);

    useEffect(() => {
        if ("serviceWorker" in navigator) {
            window.addEventListener("load", function () {
                navigator.serviceWorker.register("/serviceworker.js").then(
                    function (registration) {
                        console.log(
                            "Service Worker registration successful with scope: ",
                            registration.scope
                        );
                    },
                    function (err) {
                        console.log(
                            "Service Worker registration failed: ",
                            err
                        );
                    }
                );
            });
        }
        setDidMount(true);
    }, []);

    return (
        <Layout className={css(layoutRules)}>
            <section className={css(heroRules)}>
                <IF condition={didMount}>
                    <Carousel
                        plugins={[
                            "infinite",
                            {
                                resolve: autoplayPlugin,
                                options: {
                                    interval: 4000,
                                },
                            },
                        ]}
                        animationSpeed={1500}
                    >
                        {highlighted.map((playlist) => (
                            <HighlightedPlaylist
                                key={playlist.name}
                                playlist={playlist}
                            />
                        ))}
                    </Carousel>
                </IF>
            </section>
            <Container as="section" className={css(listRules)}>
                <Typography as="h3" variant="headline3" color="neutral0">
                    Playlists anteriores
                </Typography>
                {previous
                    .sort(
                        (first, second) => second.createdAt! - first.createdAt!
                    )
                    .map((item) => (
                        <Playlist key={item.id} playlist={item} />
                    ))}
            </Container>
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async () => {
    try {
        const [current, previous] = await Promise.all([
            axios.get("/api/playlists/highlighted", {
                baseURL: process.env.PUBLIC_URL,
            }),
            axios.get("/api/playlists/previous", {
                baseURL: process.env.PUBLIC_URL,
            }),
        ]);

        return {
            props: {
                ...current.data,
                ...previous.data,
            },
        };
    } catch (e) {
        console.log(e);
        console.log("deu ruim");
        return {
            props: {},
        };
    }
};
