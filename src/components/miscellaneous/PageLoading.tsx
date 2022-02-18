import { FC } from "react";
import classNames from "classnames";
import { StyleFunction, useFela } from "react-fela";
import { Theme } from "styles/Theme";

interface PageLoadingProps {
    status: string;
}

const rootRules: StyleFunction<Theme> = () => ({
    background: "aliceblue",
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    transition: "all 0.25",
    padding: 16,

    "&.loading": {
        opacity: 0.5,
        zIndex: 100,
    },
    "&.loaded": {
        pointerEvents: "none",
        opacity: 0,
    },
    "&.default": {
        pointerEvents: "none",
        opacity: 0,
    },
});

const PageLoading: FC<PageLoadingProps> = ({ status }) => {
    const { css } = useFela<Theme>();
    const rootClass = classNames(css(rootRules), status);

    return <div className={rootClass}></div>;
};

export default PageLoading;
