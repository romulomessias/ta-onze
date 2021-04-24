import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from "next/document";
import { renderToNodeList } from "react-fela";
import getFelaRenderer from "../styles/FelaRenderer";

class AppDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const renderer = getFelaRenderer();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        //@ts-ignore
        enhanceApp: (App) => (props) => <App {...props} renderer={renderer} />,
      });
    const initialProps = await Document.getInitialProps(ctx);

    const styles = renderToNodeList(renderer);
    return {
      ...initialProps,
      //@ts-ignore
      styles: [...initialProps.styles, ...styles],
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