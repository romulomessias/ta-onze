import axios from "axios";
import { GetServerSideProps } from "next";
import { interpolateAs } from "next/dist/next-server/lib/router/router";
import Image from "next/image";
import { useEffect } from "react";
import { StyleFunction, useFela } from "react-fela";
import Button from "../../components/buttons/Button";
import { Playlist as PlaylistModel } from "../../infra/models/playlist/Playlist";
import Container from "../../components/layouts/Container";
import Layout from "../../components/layouts/Layout";
import Playlist from "../../components/playlists/Playlist";

import Typography from "../../components/typographies/Typography";
import { Theme } from "../../styles/Theme";
import PlaylistHero from "../../components/playlists/PlaylistHero";

const layoutRules: StyleFunction<Theme> = () => ({
    paddingBottom: "calc(20px + env(safe-area-inset-bottom))",
});

const listRules: StyleFunction<Theme> = ({ theme }) => ({
    display: "grid",
    gridAutoFlow: "row",
    gap: 16,

    "> .typography": {
        color: theme.pallette.neutral0,
    },
});

interface PlaylistPageProps {
    playlist: PlaylistModel;
}

export default function PlaylistPage(props: PlaylistPageProps) {
    const { playlist } = props;
    const [image] = playlist.images;
    const { css } = useFela<Theme>();

    const handleHeroButtonClick = () => {
        const a = document.createElement("a");
        a.href = playlist.externalUrl;
        a.target = "_black";

        a.click();
    };

    console.log(image)
    return (
        <Layout className={css(layoutRules)}>
            <PlaylistHero
                logoUrl={image.url}
                primaryButtonAction={handleHeroButtonClick}
                primaryButtonLabel="Abrir no spotify"
            >
                <Typography as="h1" variant="headline1">
                    {playlist.name}
                </Typography>
                <Typography as="p" variant="subtitle" weight={300}>
                    {playlist.description}
                </Typography>

                <Typography as="p" weight={300}>
                    atualmente com <strong>{playlist.tracks.total}</strong>{" "}
                    músicas
                </Typography>
            </PlaylistHero>
            <Container as="section" className={css(listRules)}>
                <Typography as="h3" variant="headline3"></Typography>
            </Container>
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.query;
    console.log(id, `/api/playlists/${id}`);
    try {
        console.log;
        const { data } = await axios.get(`/api/playlist/${id}`, {
            baseURL: process.env.PUBLIC_URL,
        });

        // console.log(data);
        return {
            props: {
                playlist: data,
            },
        };
    } catch (e) {
        console.log(e);
        return { redirect: { destination: "/404", permanent: false } };
    }
};
