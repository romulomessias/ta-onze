import { MouseEventHandler, FC } from "react";
import { StyleFunction, useFela } from "react-fela";
import Image from "next/image";
import Button from "../../components/buttons/Button";
import Container from "../../components/layouts/Container";
import { Theme } from "../../styles/Theme";
import classNames from "classnames";

const heroRules: StyleFunction<Theme> = ({ theme }) => ({
    display: "grid",
    gridAutoFlow: "column",
    justifyContent: "flex-start",
    gridTemplateColumns: "max-content 1fr 210px",
    alignItems: "center",
    gap: 32,
    color: theme.pallette.neutral0,
    [theme.breakpoint.small]: {
        gridAutoFlow: "row",
        gridTemplateColumns: "auto",
        gap: 16,
    },
    "> .button ": {
        marginLeft: "auto",
    },
});

const headerRules: StyleFunction<Theme> = ({ theme }) => ({
    backgroundColor: theme.pallette.navy30,
    paddingTop: 24,
    paddingBottom: 24,
});

const titleRules: StyleFunction<Theme> = ({ theme }) => ({
    "> .typography span ": {
        color: theme.pallette.aqua10,
    },
    borderRadius: 8,
    "> .typography.body": {
        marginTop: 8,
    },
});

const logoRules: StyleFunction<Theme> = ({ theme }) => ({
    borderRadius: 8,
    borderStyle: "solid !important",
    borderWidth: "2px !important",
    borderColor: `${theme.pallette.aqua0} !important`,
});

interface PlaylistHeroProps {
    logoUrl: string;
    primaryButtonLabel: string;
    primaryButtonAction: MouseEventHandler<any>;
    className?: string;
}

const PlaylistHero: FC<PlaylistHeroProps> = ({
    className,
    children,
    logoUrl,
    primaryButtonAction,
    primaryButtonLabel,
}) => {
    const { css } = useFela<Theme>();
    const rootClass = classNames(css(headerRules), className);
    return (
        <header className={rootClass}>
            <Container className={css(heroRules)}>
                <Image
                    src={logoUrl}
                    height={172}
                    width={172}
                    layout="fixed"
                    className={css(logoRules)}
                />
                <section className={css(titleRules)}>{children}</section>
                <Button onClick={primaryButtonAction}>
                    {primaryButtonLabel}
                </Button>
            </Container>
        </header>
    );
};

export default PlaylistHero;
