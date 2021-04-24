import Container from "../components/layouts/Container";
import Layout from "../components/layouts/Layout";
import Typography from "../components/typografies/Typography";

export default function Home() {
    return (
        <Layout>
            <Container>
                <Typography as="h1" variant="headline1">
                    My Title
                </Typography>
                <Typography as="p">Hi, I am Fela.</Typography>
            </Container>
        </Layout>
    );
}
