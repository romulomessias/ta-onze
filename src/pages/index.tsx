import Image from "next/image";
import { StyleFunction, useFela } from "react-fela";

import Container from "../components/layouts/Container";
import Layout from "../components/layouts/Layout";
import Typography from "../components/typographies/Typography";
import { Theme } from "../styles/Theme";

const heroRules: StyleFunction<Theme> = ({ theme }) => ({
    color: theme.pallette.neutral0,
    display: "grid",
    gridAutoFlow: "column",
    gap: 32,
    justifyContent: "flex-start",
});

const headerRules: StyleFunction<Theme> = ({ theme }) => ({
    backgroundColor: theme.pallette.navy30,
    paddingTop: 24,
    paddingBottom: 24,
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
                        className={css(logoRules)}
                    />
                    <section>
                        <Typography as="h1" variant="headline1">
                            Tá Onze!
                        </Typography>
                        <Typography as="p" weight={300}>
                            A playlist quinzenal do time mais badalado da RV
                        </Typography>
                    </section>
                </Container>
            </header>
        </Layout>
    );
}
