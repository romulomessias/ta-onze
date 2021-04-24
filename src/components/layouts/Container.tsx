import { FC } from "react";
import { StyleFunction, useFela } from "react-fela";
import { Theme } from "../../styles/Theme";

interface ContainerProps {}

const containerRules: StyleFunction<Theme> = ({ theme }) => ({
    paddingLeft: 20,
    paddingRight: 20,
    color: theme.pallette.navy0,
});

const Container: FC<ContainerProps> = ({ children }) => {
    const { css } = useFela<Theme>();
    return <div className={css(containerRules)}>{children}</div>;
};

export default Container;
