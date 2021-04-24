import type { AppProps, AppContext } from "next/app";
import { FC } from "react";
import FelaProvider, { FelaProviderProps } from "../styles/FelaProvider";

export type IAppProps = AppProps & FelaProviderProps;

const App: FC<IAppProps> = ({ Component, pageProps, renderer }) => (
  <FelaProvider renderer={renderer}>
    <Component {...pageProps} />
  </FelaProvider>
);

export default App;
