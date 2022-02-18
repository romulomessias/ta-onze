import { createElement, FC, HTMLAttributes } from "react";
import { StyleFunction, useFela } from "react-fela";
import classNames from "classnames";

import { ColorKey, Theme } from "styles/Theme";

type variantsType =
    | "headline1"
    | "headline4"
    | "headline3"
    | "subtitle"
    | "body"
    | "button"
    | "caption";
type weightType = 300 | 500 | 700;

interface TypographyProps extends HTMLAttributes<HTMLElement> {
    as?: keyof React.ReactHTML;
    variant?: variantsType;
    weight?: weightType;
    className?: string;
    color?: ColorKey;
}

const typographyRules: StyleFunction<Theme, TypographyProps> = ({
    color,
    theme,
}) => {
    return {
        fontFamily: "Rubik, sans-serif",
        letterSpacing: 0,
        margin: 0,
        color: color ? theme.pallette[color] : "inherit",
    };
};

const headline1Rules: StyleFunction<{}, TypographyProps> = ({
    weight = 500,
}) => ({
    fontSize: 56,
    lineHeight: "70px",
    fontWeight: weight,
});

const headline3Rules: StyleFunction<{}, TypographyProps> = ({
    weight = 500,
}) => ({
    fontSize: 40,
    lineHeight: "50px",
    fontWeight: weight,
});

const headline4Rules: StyleFunction<{}, TypographyProps> = ({
    weight = 500,
}) => ({
    fontSize: 32,
    lineHeight: "40px",
    fontWeight: weight,
});

const subtitleRules: StyleFunction<{}, TypographyProps> = ({
    weight = 500,
}) => ({
    fontSize: 24,
    lineHeight: "32px",
    fontWeight: weight,
});

const bodyRules: StyleFunction<{}, TypographyProps> = ({ weight = 300 }) => ({
    // className: "body",
    fontSize: 16,
    lineHeight: "24px",
    fontWeight: weight,
});

const buttonRules: StyleFunction<{}, TypographyProps> = ({ weight = 700 }) => ({
    fontSize: 18,
    lineHeight: "26px",
    fontWeight: weight,
});

const captionRules: StyleFunction<{}, TypographyProps> = ({
    weight = 300,
}) => ({
    fontSize: 12,
    lineHeight: "16px",
    fontWeight: weight,
});

const variantRuleMapper: Record<variantsType, StyleFunction<{}>> = {
    headline1: headline1Rules,
    headline3: headline3Rules,
    headline4: headline4Rules,
    subtitle: subtitleRules,
    body: bodyRules,
    button: buttonRules,
    caption: captionRules,
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
    const { css } = useFela<Theme, TypographyProps>({ weight, color });
    const variantRule = variantRuleMapper[variant];
    const rootClass = classNames(
        css(typographyRules),
        css(variantRule),
        className
    );

    return createElement(as, { className: rootClass, ...props }, children);
};

export default Typography;
