import { FC } from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import FelaProvider, { FelaProviderProps } from "../styles/FelaProvider";

export type IAppProps = AppProps & FelaProviderProps;

const App: FC<IAppProps> = ({ Component, pageProps, renderer }) => (
  <>
    <Head>
      <title>Tá Onze!</title>
      <link rel="shortcut icon" href="/logo.jpeg" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;500;700&display=swap"
        rel="stylesheet"
      />
    </Head>
    <FelaProvider renderer={renderer}>
      <Component {...pageProps} />
    </FelaProvider>
  </>
);

export default App;
