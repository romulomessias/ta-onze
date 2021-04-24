import { createElement, FC } from "react";
import { StyleFunction, useFela } from "react-fela";
import classNames from "classnames";
import { ColorKey, Theme } from "../../styles/Theme";
type variantsType = "headline1" | "body" | "button";
type weightType = 300 | 500 | 700;

interface TypographyProps {
    as?: keyof React.ReactHTML;
    variant?: variantsType;
    weight?: weightType;
    className?: string;
    color?: ColorKey;
}

const typographyRules: StyleFunction<Theme, TypographyProps> = ({
    weight,
    color,
    theme,
}) => ({
    className: "typography",
    fontFamily: "Rubik, sans-serif",
    letterSpacing: 0,
    fontWeight: weight,
    margin: 0,
    color: color ? theme.pallette[color] : "inherit",
});

const headline1Rules: StyleFunction<{}, TypographyProps> = ({
    weight = 300,
}) => ({
    fontSize: 64,
    lineHeight: "96px",
    fontWeight: weight,
});

const bodyRules: StyleFunction<{}, TypographyProps> = ({ weight = 500 }) => ({
    className: "body",
    fontSize: 16,
    lineHeight: "24px",
    fontWeight: weight,
});

const buttonRules: StyleFunction<{}, TypographyProps> = ({ weight = 500 }) => ({
    fontSize: 18,
    lineHeight: "26px",
    fontWeight: weight,
});

const variantRuleMapper: Record<variantsType, StyleFunction<{}>> = {
    headline1: headline1Rules,
    body: bodyRules,
    button: buttonRules,
};

const Typography: FC<TypographyProps> = ({
    as = "p",
    variant = "body",
    className,
    children,
    weight,
    color,
    ...props
}) => {
    const { css } = useFela<Theme>({ weight, color });
    const variantRule = variantRuleMapper[variant];
    const rootClass = classNames(
        css(typographyRules),
        css(variantRule),
        className
    );

    return createElement(as, { className: rootClass, ...props }, children);
};

export default Typography;
