import React, { useEffect, useState } from "react";
import axios from "axios";
import { NextPage, GetServerSideProps } from "next";
import { StyleFunction, useFela } from "react-fela";
import { useRouter } from "next/router";
import cookie from "cookie";

import Layout from "components/layouts/Layout";
import Typography from "components/typographies/Typography";
import Container from "components/layouts/Container";
import Button from "components/buttons/Button";
import Condition from "components/layouts/Condition";
import { Theme } from "styles/Theme";
import { Playlist } from "infra/models/playlist/Playlist";
import PageLoading from "components/miscellaneous/PageLoading";
import PlaylistItem from "components/playlists/dashboard/PlaylistItem";
import { getUserProfile } from "services/spotify";

interface SingInPageProps {
    hasPermission: boolean;
}

const headerRules: StyleFunction<Theme> = ({ theme }) => ({
    minHeight: 260,
    backgroundColor: theme.pallette.navy30,
    paddingTop: 24,
    paddingBottom: 24,
});

const containerRules: StyleFunction<Theme> = ({ theme }) => ({
    color: theme.pallette.neutral0,
    display: "grid",
    gap: 32,
    // justifyContent: "flex-start",
    "> *": {
        marginRight: "auto",
    },
});

const contentContainerRules: StyleFunction<Theme> = ({ theme }) => ({
    color: theme.pallette.neutral0,
    display: "grid",
    gap: 16,
    // justifyContent: "flex-start",
    "> *": {
        marginRight: "auto",
    },
});

const SingInPage: NextPage<SingInPageProps> = ({ hasPermission }) => {
    const router = useRouter();
    const { css } = useFela<Theme>();

    const onButtonClick = () => {
        router.push("/api/turnon");
    };

    const [isClearingPlaylist, setIsClearingPlaylist] = useState(false);
    const [playlistLoaderStatus, setPlaylistLoadingStatus] =
        useState("default");
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [lastPageEvaluated, setLstPageEvaluated] = useState<
        string | undefined
    >();

    interface PlaylistResponse {
        playlists: Playlist[];
        lastPageEvaluated: string | undefined;
    }

    const onCleatPlaylistButtonClick = () => {
        setIsClearingPlaylist(true);
        axios
            .post("/api/playlist")
            .then(() => alert("A playlist tá limpa meu caro!"))
            .catch(() => alert("Tenha calma meu jovem! Tente mais uma vez!"))
            .finally(() => setIsClearingPlaylist(false));
    };

    const handleLoadPlaylist = () => {
        setPlaylistLoadingStatus("loading");
        return axios
            .get<PlaylistResponse>("/api/playlists", {
                baseURL: process.env.PUBLIC_URL,
                params: {
                    lastPageEvaluated,
                },
            })
            .then(({ data }) => {
                setPlaylists([...playlists, ...data.playlists]);
                setLstPageEvaluated(data.lastPageEvaluated);
            })
            .finally(() => {
                setPlaylistLoadingStatus("loaded");
            });
    };

    useEffect(() => {
        if (hasPermission) {
            handleLoadPlaylist();
        }
    }, []);

    return (
        <Layout>
            <header className={css(headerRules)}>
                <Container className={css(containerRules)}>
                    <Typography as="h1" variant="headline1">
                        Spotify integration
                    </Typography>

                    <Condition>
                        <Condition.IF condition={hasPermission}>
                            <Button
                                onClick={onCleatPlaylistButtonClick}
                                disabled={isClearingPlaylist}
                            >
                                Clear current playlist
                            </Button>
                        </Condition.IF>

                        <Condition.IF condition={!hasPermission}>
                            <Button onClick={onButtonClick}>Login</Button>
                        </Condition.IF>
                    </Condition>
                </Container>
            </header>
            <Container as="section" className={css(contentContainerRules)}>
                <PageLoading status={playlistLoaderStatus} />
                <Condition.IF condition={hasPermission}>
                    <Typography>
                        <Condition>
                            <Condition.IF
                                condition={playlistLoaderStatus === "loading"}
                            >
                                Carreando playlists
                            </Condition.IF>
                            <Condition.IF condition={playlists.length == 0}>
                                Nenhuma playlist carregada
                            </Condition.IF>
                            <Condition.IF condition={playlists.length == 1}>
                                {" "}
                                <strong>{playlists.length}</strong> playlist
                                carregada
                            </Condition.IF>
                            <Condition.IF condition={playlists.length > 1}>
                                <strong>{playlists.length}</strong> playlists
                                carregadas
                            </Condition.IF>
                        </Condition>
                    </Typography>
                    {playlists.map((playlist) => (
                        <PlaylistItem key={playlist.id} playlist={playlist} />
                    ))}
                </Condition.IF>

                <Condition.IF
                    condition={
                        hasPermission &&
                        lastPageEvaluated !== undefined &&
                        playlists.length > 0
                    }
                >
                    <Button
                        onClick={handleLoadPlaylist}
                        disabled={playlistLoaderStatus === "loading"}
                    >
                        Carregar Mais
                    </Button>
                </Condition.IF>
            </Container>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookies = cookie.parse(context.req.headers.cookie || "");

    let hasPermission = false;
    if (cookies.play) {
        const profile = await getUserProfile(cookies.play);
        hasPermission = process.env.SPOTIFY_PLAYLIST_HOLDER_ID === profile.id;
    }
    return {
        props: {
            hasPermission,
        },
    };
};

export default SingInPage;
