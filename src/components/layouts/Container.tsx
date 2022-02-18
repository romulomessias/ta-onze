import { createElement, FC } from "react";
import { StyleFunction, useFela } from "react-fela";
import classNames from "classnames";
import { Theme } from "styles/Theme";

interface ContainerProps {
    as?: keyof React.ReactHTML;
    className?: string;
}

const containerRules: StyleFunction<Theme> = () => ({
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 20,
    maxWidth: 1200,
    marginLeft: "auto",
    marginRight: "auto",
});

const Container: FC<ContainerProps> = ({
    as = "div",
    children,
    className,
    ...props
}) => {
    const { css } = useFela<Theme>();
    const rootClass = classNames(css(containerRules), className);
    return createElement(as, { className: rootClass, ...props }, children);
};

export default Container;
