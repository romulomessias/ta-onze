import React from "react";
import { NextPage } from "next";
import { StyleFunction, useFela } from "react-fela";

import Layout from "../components/layouts/Layout";
import Typography from "../components/typographies/Typography";
import Container from "../components/layouts/Container";
import { Theme } from "../styles/Theme";

interface OfflinePageProps {
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

const OfflinePage: NextPage<OfflinePageProps> = () => {
    const { css } = useFela<Theme>();

    return (
        <Layout>
            <header className={css(headerRules)}>
                <Container className={css(containerRules)}>
                    <Typography as="h1" variant="headline1">
                        You are offiline
                    </Typography>

                    <Typography variant="subtitle" weight={300}>
                        you already has synced your account!!!1!
                    </Typography>
                </Container>
            </header>
            <Container as="section"></Container>
        </Layout>
    );
};

export default OfflinePage;
