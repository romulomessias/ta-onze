import { FC } from "react";
import { StyleFunction, useFela } from "react-fela";

interface ContainerProps {}

const containerRules: StyleFunction<{}> = () => ({
    borderColor: "red",
    borderStyle: "solid",
    borderWidth: 1,
    paddingLeft: 20,
    paddingRight: 20,
});

const Container: FC<ContainerProps> = ({ children }) => {
    const { css } = useFela();

    return <div className={css(containerRules)}>{children}</div>;
};

export default Container;
