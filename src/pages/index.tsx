import axios from "axios";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { StyleFunction, useFela } from "react-fela";
import Button from "../components/buttons/Button";

import Container from "../components/layouts/Container";
import Layout from "../components/layouts/Layout";
// import CurrentPlaylist from "../components/playlists/CurrentPlaylist";
import Playlist from "../components/playlists/Playlist";
import Typography from "../components/typographies/Typography";
import { PlaylistItem } from "../infra/spotify/SpotifyPlaylist";
import { Theme } from "../styles/Theme";

const heroRules: StyleFunction<Theme> = ({ theme }) => ({
    display: "grid",
    gridAutoFlow: "column",
    justifyContent: "flex-start",
    gridTemplateColumns: "max-content 1fr 210px",
    alignItems: "center",
    gap: 32,
    color: theme.pallette.neutral0,
    [theme.breakpoint.small]: {
        gridAutoFlow: "row",
        gridTemplateColumns: "auto",
        gap: 16,
    },
    "> .button ": {
        marginLeft: "auto",
    },
});

const headerRules: StyleFunction<Theme> = ({ theme }) => ({
    backgroundColor: theme.pallette.navy30,
    paddingTop: 24,
    paddingBottom: 24,
});

const titleRules: StyleFunction<Theme> = ({ theme }) => ({
    "> .typography span ": {
        color: theme.pallette.aqua10,
    },

    "> .typography.body": {
        // color: theme.pallette.aqua10,
        marginTop: 8,
    },
});

const logoRules: StyleFunction<Theme> = () => ({
    borderRadius: 8,
});

const listRules: StyleFunction<Theme> = ({ theme }) => ({
    display: "grid",
    gridAutoFlow: "row",
    gap: 16,

    "> .typography": {
        color: theme.pallette.neutral0,
    },
});

interface IndexProps {
    current: PlaylistItem;
    previous: PlaylistItem[];
}

export default function Index({ current, previous = [] }: IndexProps) {
    const { css } = useFela<Theme>();

    const onButtonClick = () => {
        if(!current) {
            alert("Sorry! Não deu pra abrir a playlist :(")
        }
        const a = document.createElement("a");
        a.href = current.external_urls.spotify;
        a.target = "_black";

        a.click();
    };
    return (
        <Layout>
            <header className={css(headerRules)}>
                <Container className={css(heroRules)}>
                    <Image
                        src="/logo.jpeg"
                        height={172}
                        width={172}
                        layout="fixed"
                        className={css(logoRules)}
                    />
                    <section className={css(titleRules)}>
                        <Typography as="h1" variant="headline1">
                            Tá Onze<span>!</span>
                        </Typography>
                        <Typography as="p" variant="subtitle" weight={300}>
                            A playlist quinzenal do time mais badalado da{" "}
                            <strong>RV</strong>
                        </Typography>

                       {current && <Typography as="p" weight={300}>
                            atualmente com{" "}
                            <strong>{current.tracks.total}</strong> músicas
                        </Typography>}
                    </section>

                    <Button onClick={onButtonClick}>Abrir no Spotify</Button>
                </Container>
            </header>
            <Container as="section" className={css(listRules)}>
                <Typography as="h3" variant="headline3">
                    Playlists anteriores
                </Typography>
                {previous.map((item) => (
                    <Playlist key={item.id} playlist={item} />
                ))}
            </Container>
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async () => {
    try {
        const { data } = await axios.get("/api/playlists", {
            baseURL: process.env.PUBLIC_URL,
        });

        return {
            props: {
                ...data,
            },
        };
    } catch {
        console.log("deu ruim");
    }

    return {
        props: {},
    };
};
