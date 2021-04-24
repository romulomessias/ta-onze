import { IRenderer } from "fela";
import { FC } from "react";
import { RendererProvider, ThemeProvider } from "react-fela";
import getFelaRenderer from "./FelaRenderer";
import { theme } from "./Theme";

const fallbackRenderer = getFelaRenderer();

export interface FelaProviderProps {
    renderer: IRenderer;
}

const FelaProvider: FC<FelaProviderProps> = ({ children }) => {
    const currentRenderer =  fallbackRenderer;
    return (
        <RendererProvider renderer={currentRenderer}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </RendererProvider>
    );
};

export default FelaProvider;
