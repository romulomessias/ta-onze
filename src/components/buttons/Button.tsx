import { FC, ButtonHTMLAttributes } from "react";
import classNames from "classnames";
import { StyleFunction, useFela } from "react-fela";
import { Theme } from "../../styles/Theme";
import Typography from "../typographies/Typography";

type variantKeys = "primary" | "secondary" | "ghost";
type colorKeys = "light" | "dark";

interface IButtonProps {
    variant?: variantKeys;
    color?: colorKeys;
}

type ButtonProps = IButtonProps & ButtonHTMLAttributes<HTMLButtonElement>;

const buttonRules: StyleFunction<Theme, IButtonProps> = ({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    ":focus": {
        outline: "none",
        borderColor: "#3C70C1",
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

const variantRulesMap: Record<variantKeys, StyleFunction<Theme>> = {
    primary: primaryRules,
    secondary: secondaryRules,
    ghost: primaryRules,
};

const Button: FC<ButtonProps> = ({
    children,
    className,
    variant = "secondary",
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
