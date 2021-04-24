import { createRenderer } from "fela";
import webPreset from 'fela-preset-web'

function getFelaRenderer() {
    return createRenderer({
        plugins: [...webPreset],
        devMode: process.env.NODE_ENV !== 'production',
    })
}

export default getFelaRenderer