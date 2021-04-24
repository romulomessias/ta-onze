import { IRenderer } from "fela";
import { FC } from "react";
import { RendererProvider } from "react-fela";
import getFelaRenderer from "./FelaRenderer";

const fallbackRenderer = getFelaRenderer();

export interface FelaProviderProps {
  renderer: IRenderer;
}

const FelaProvider: FC<FelaProviderProps> = ({ renderer, children }) => {
  const currentRenderer = renderer ?? fallbackRenderer;

  return (
    <RendererProvider renderer={currentRenderer}>{children}</RendererProvider>
  );
};

export default FelaProvider;
