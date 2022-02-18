import { FC, ButtonHTMLAttributes } from "react";
import classNames from "classnames";
import { StyleFunction, useFela } from "react-fela";

import Typography from "components/typographies/Typography";
import { Theme } from "styles/Theme";

type variantKeys = "primary" | "secondary" | "ghost";
type colorKeys = "light" | "dark";

interface IButtonProps {
    variant?: variantKeys;
    color?: colorKeys;
}

type ButtonProps = IButtonProps & ButtonHTMLAttributes<HTMLButtonElement>;

const buttonRules: StyleFunction<Theme, IButtonProps> = () => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    ":focus": {
        outline: "none",
        borderColor: "#3C70C1",
    },
    ":disabled": {
        opacity: 0.5,
    },
});

const primaryRules: StyleFunction<Theme, IButtonProps> = ({ theme }) => ({
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 24,
    paddingRight: 24,
    borderRadius: 28,
    backgroundColor: theme.pallette.aqua20,
    color: theme.pallette.navy40,
    borderColor: theme.pallette.aqua20,
    borderStyle: "solid",
    height: 56,
    ":hover": {
        backgroundColor: theme.pallette.aqua30,
    },
});

const secondaryRules: StyleFunction<Theme, IButtonProps> = ({
    theme,
    color,
}) => ({
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 24,
    paddingRight: 24,
    borderRadius: 28,
    backgroundColor:
        color === "light" ? theme.pallette.neutral0 : theme.pallette.navy40,
    color: color === "light" ? theme.pallette.navy20 : theme.pallette.aqua20,
    borderWidth: 2,
    borderColor: theme.pallette.aqua20,
    borderStyle: "solid",
    height: 56,
    ":hover": {
        backgroundColor:
            color === "light" ? theme.pallette.aqua0 : theme.pallette.navy30,
    },
});

const ghostRules: StyleFunction<Theme, IButtonProps> = ({ theme, color }) => ({
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 8,
    backgroundColor: "transparent",
    color: color === "light" ? theme.pallette.navy20 : theme.pallette.aqua20,
    borderWidth: 2,
    borderColor: "transparent",
    borderStyle: "solid",
    height: 56,
    ":hover": {
        backgroundColor:
            color === "light" ? theme.pallette.aqua0 : theme.pallette.navy30,
    },
});

const variantRulesMap: Record<variantKeys, StyleFunction<Theme>> = {
    primary: primaryRules,
    secondary: secondaryRules,
    ghost: ghostRules,
};

const Button: FC<ButtonProps> = ({
    children,
    className,
    variant = "primary",
    color = "light",
    ...props
}) => {
    const { css } = useFela<Theme>({ color });
    const variantRule = variantRulesMap[variant];
    const rootClass = classNames(css(buttonRules), css(variantRule), className);

    return (
        <button className={rootClass} {...props}>
            <Typography as="span" variant="button">
                {children}
            </Typography>
        </button>
    );
};

export default Button;
