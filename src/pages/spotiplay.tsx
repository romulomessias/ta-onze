import React, { useEffect } from "react";
import axios from "axios";
import { NextPage, GetServerSideProps } from "next";
import { StyleFunction, useFela } from "react-fela";
import { useRouter } from "next/router";

import Layout from "../components/layouts/Layout";
import Typography from "../components/typographies/Typography";
import Container from "../components/layouts/Container";
import Button from "../components/buttons/Button";
import { Theme } from "../styles/Theme";
import Condition from "../components/Condition";

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

    const onSlackButtonClick = () => {
        const params = [
            "scope=incoming-webhook,commands",
            `client_id=${process.env.SLACK_CLIENT_ID}`,
            `redirect_uri=${window.location.href}`,
        ];
        router.push(`https://slack.com/oauth/v2/authorize?` + params.join("&"));
    };

    const onCleatPlaylistButtonClick = () => {
        // axios.post('/api/playlist')
        alert('Tenha calma meu jovem!')
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
                <Condition>
                    <Condition.IF condition={hasPermission}>
                        <Button onClick={onCleatPlaylistButtonClick}>
                            Clear current playlist
                        </Button>
                    </Condition.IF>
                </Condition>

                <Condition>
                    {/* <Condition.IF condition={hasPermission}>
                        <Button onClick={onSlackButtonClick}>Link slack</Button>
                    </Condition.IF> */}
                </Condition>
            </Container>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
    let hasPermission = false;

    try {
        const { data } = await axios.get("/api/canyouhear", {
            baseURL: process.env.PUBLIC_URL,
        });
        hasPermission = data.hasPermission ?? false;
    } catch (e) {
        console.error(e);
        hasPermission = false;
    }

    return {
        props: {
            hasPermission,
        },
    };
};

export default SingInPage;
