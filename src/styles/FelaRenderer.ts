import { createRenderer } from "fela";
import webPreset from "fela-preset-web";
import monolithic from "fela-monolithic";

const devMode = process.env.NODE_ENV !== "production";

console.log({devMode})
function getFelaRenderer() {
    return createRenderer({
        plugins: [...webPreset],
        enhancers: [monolithic({ prettySelectors: devMode })],
        devMode,
    });
}

export default getFelaRenderer;
