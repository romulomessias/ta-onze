import React, { useState } from "react";
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
    justifyContent: "flex-start",
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
    const onCleatPlaylistButtonClick = () => {
        setIsClearingPlaylist(true);
        axios
            .post("/api/playlist")
            .then(() => alert("A playlist tá limpa meu caro!"))
            .catch(() => alert("Tenha calma meu jovem! Tente mais uma vez!"))
            .finally(() => setIsClearingPlaylist(false));
    };

    return (
        <Layout>
            <header className={css(headerRules)}>
                <Container className={css(containerRules)}>
                    <Typography as="h1" variant="headline1">
                        Spotify integration
                    </Typography>

                    <Condition>
                        <Condition.IF condition={hasPermission}>
                            <Typography variant="subtitle" weight={300}>
                                you already has synced your account!!!1!
                            </Typography>
                        </Condition.IF>

                        <Condition.IF condition={!hasPermission}>
                            <Button onClick={onButtonClick}>Login</Button>
                        </Condition.IF>
                    </Condition>
                </Container>
            </header>
            <Container as="section">
                <Condition.IF condition={hasPermission}>
                    <Button
                        onClick={onCleatPlaylistButtonClick}
                        disabled={isClearingPlaylist}
                    >
                        Clear current playlist
                    </Button>
                </Condition.IF>
            </Container>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookies = cookie.parse(context.req.headers.cookie || "");

    // try {
    //     const { data } = await axios.get("/api/canyouhear", {
    //         baseURL: process.env.PUBLIC_URL,
    //     });
    //     hasPermission = data.hasPermission ?? false;
    // } catch (e) {
    //     console.error(e);
    //     hasPermission = false;
    // }

    return {
        props: {
            hasPermission: cookies.play !== undefined,
        },
    };
};

export default SingInPage;
