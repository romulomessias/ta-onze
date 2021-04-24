import Document, {
    DocumentContext,
    Html,
    Head,
    Main,
    NextScript,
} from "next/document";
import { renderToNodeList } from "react-fela";
import { baseStyle, globalStyle } from "../styles/global.styles";
import getFelaRenderer from "../styles/FelaRenderer";

class AppDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const renderer = getFelaRenderer();
        renderer.renderStatic(baseStyle, "html,body,#app");
        renderer.renderStatic(globalStyle, "*");

        const originalRenderPage = ctx.renderPage;
        ctx.renderPage = () =>
            originalRenderPage({
                enhanceApp: (App) => (props) => {
                    const currentProps = { ...props, renderer };
                    return <App {...currentProps} />;
                },
            });

        const initialProps = await Document.getInitialProps(ctx);
        const initialStyles = initialProps.styles as [];
        const styles = renderToNodeList(renderer);
        return {
            ...initialProps,
            styles: [...initialStyles, ...styles],
        };
    }

    render() {
        return (
            <Html>
                <Head />
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default AppDocument;
