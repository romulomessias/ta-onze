import React from "react";
import axios from "axios";
import { NextPage, GetServerSideProps } from "next";
import { StyleFunction, useFela } from "react-fela";
import { useRouter } from "next/router";

import Layout from "../components/layouts/Layout";
import Typography from "../components/typographies/Typography";
import Container from "../components/layouts/Container";
import Button from "../components/buttons/Button";
import { Theme } from "../styles/Theme";

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

    return (
        <Layout>
            <header className={css(headerRules)}>
                <Container className={css(containerRules)}>
                    <Typography as="h1" variant="headline1">
                        Spotify integration
                    </Typography>

                    {!hasPermission && (
                        <Button onClick={onButtonClick}>Login</Button>
                    )}
                    {hasPermission && (
                        <Typography variant="subtitle" weight={300}>
                            you already has synced your account!!!1!
                        </Typography>
                    )}
                </Container>
            </header>
            <Container as="section">{hasPermission}</Container>
        </Layout>
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
    let hasPermission = false;

    try {
        
        const { data } = await axios.get("/api/canyouhear", {
            baseURL: process.env.PUBLIC_URL,
        });
        console.log({data});
        hasPermission = data.hasPermission ?? false;
    } catch {
        console.log("deu ruim")
    }

    return {
        props: {
            hasPermission,
        },
    };
};

export default SingInPage;
