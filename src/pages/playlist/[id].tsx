import axios from "axios";
import { GetServerSideProps } from "next";
import { StyleFunction, useFela } from "react-fela";
import { Playlist as PlaylistModel } from "../../infra/models/playlist/Playlist";
import Container from "../../components/layouts/Container";
import Layout from "../../components/layouts/Layout";
import Typography from "../../components/typographies/Typography";
import { Theme } from "../../styles/Theme";
import PlaylistHero from "../../components/playlists/PlaylistHero";
import TrackSection from "../../components/tracks/TrackSection";

const layoutRules: StyleFunction<Theme> = ({ theme }) => ({
    backgroundColor: theme.pallette.neutral10,
    paddingBottom: "calc(20px + env(safe-area-inset-bottom))",
});

const contentRules: StyleFunction<Theme> = ({ theme }) => ({
    display: "grid",
    gridAutoFlow: "row",
    gap: 16,

    "> .typography": {
        color: theme.pallette.navy30,
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
                    com <strong>{playlist.tracks.total}</strong> músicas
                </Typography>
            </PlaylistHero>
            <Container as="section" className={css(contentRules)}>
                <Typography as="h3" variant="headline3">
                    Musícas
                </Typography>
                <TrackSection tracks={playlist.tracks} />
            </Container>
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.query;

    try {
        console.log;
        const { data } = await axios.get(`/api/playlist/${id}`, {
            baseURL: process.env.PUBLIC_URL,
        });

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
