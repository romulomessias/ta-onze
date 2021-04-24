import { FC } from "react";
import { StyleFunction, useFela } from "react-fela";
import classNames from "classnames";
import { Theme } from "../../styles/Theme";

interface ContainerProps {
    className?: string;
}

const containerRules: StyleFunction<Theme> = () => ({
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 20,
});

const Container: FC<ContainerProps> = ({ children, className }) => {
    const { css } = useFela<Theme>();
    const rootClass = classNames(css(containerRules), className);
    return <div className={rootClass}>{children}</div>;
};

export default Container;
