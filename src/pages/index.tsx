import Image from "next/image";
import { StyleFunction, useFela } from "react-fela";

import Container from "../components/layouts/Container";
import Layout from "../components/layouts/Layout";
import Typography from "../components/typographies/Typography";
import { Theme } from "../styles/Theme";

const indexRules: StyleFunction<Theme> = ({ theme }) => ({
    color: theme.pallette.navy0,
    display: "grid",
    gridAutoFlow: "column",
    gap: 20,
    justifyContent: "flex-start",
});

const logoRules: StyleFunction<Theme> = () => ({
    borderRadius: 8,
});

export default function Index() {
    const { css } = useFela<Theme>();
    return (
        <Layout>
            <Container className={css(indexRules)}>
                <Image
                    src="/logo.jpeg"
                    height={300}
                    width={300}
                    className={css(logoRules)}
                />
                <section>
                    <Typography as="h1" variant="headline1">
                        Tá Onze!
                    </Typography>
                    <Typography as="p">
                        A playlist quinzenal do time mais badalado da RV
                    </Typography>
                </section>
            </Container>
        </Layout>
    );
}
