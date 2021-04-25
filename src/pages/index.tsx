import Image from "next/image";
import { StyleFunction, useFela } from "react-fela";

import Container from "../components/layouts/Container";
import Layout from "../components/layouts/Layout";
import Typography from "../components/typographies/Typography";
import { Theme } from "../styles/Theme";

const heroRules: StyleFunction<Theme> = ({ theme }) => ({
    display: "grid",
    gridAutoFlow: "column",
    justifyContent: "flex-start",
    gap: 32,
    color: theme.pallette.neutral0,
    [theme.breakpoint.small]: {
        gridAutoFlow: "row",
        gap: 16,
    },
});

const headerRules: StyleFunction<Theme> = ({ theme }) => ({
    backgroundColor: theme.pallette.navy30,
    paddingTop: 24,
    paddingBottom: 24,
});

const titleRules: StyleFunction<Theme> = ({ theme }) => ({
    margin: "auto",
    "> .typography span ": {
        color: theme.pallette.aqua10,
    },
});

const logoRules: StyleFunction<Theme> = () => ({
    borderRadius: 8,
});

export default function Index() {
    const { css } = useFela<Theme>();
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
                    </section>
                </Container>
            </header>
            <Container as="section"></Container>
        </Layout>
    );
}
