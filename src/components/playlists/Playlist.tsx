import { FC } from "react";
import { StyleFunction, useFela } from "react-fela";
import { Playlist as PlaylistModel } from "../../infra/models/playlist/Playlist";
import { Theme } from "../../styles/Theme";
import Button from "../buttons/Button";
import { IF } from "../layouts/Condition";
import Typography from "../typographies/Typography";

interface PlaylistProps {
    playlist: PlaylistModel;
}

const rootRules: StyleFunction<Theme> = ({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "max-content auto 196px",
    gap: 24,
    alignItems: "center",
    padding: 4,
    paddingRight: 8,
    borderRadius: 8,
    color: theme.pallette.neutral30,
    backgroundColor: theme.pallette.neutral10,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: theme.pallette.neutral10,

    [theme.breakpoint.small]: {
        gridAutoFlow: "row",
        gridTemplateColumns: "auto",
        padding: 8,
        gap: 16,
    },
});

const coverRules: StyleFunction<Theme> = ({ theme }) => ({
    borderRadius: 8,
    height: 172,
    width: 172,

    [theme.breakpoint.small]: {
        justifySelf: "center",
        height: "unset",
        width: "100%",
        objectFit: "cover",
    },

    ...theme.elevation.level2,
});

const contentGroupRules: StyleFunction<Theme> = () => ({
    display: "grid",
    gap: 4,
});

const genresGroupRules: StyleFunction<Theme> = () => ({
    display: "grid",
    gap: 8,
    gridAutoFlow: "column",
    justifyContent: "flex-start",
});

const genresRules: StyleFunction<Theme> = ({ theme }) => ({
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.pallette.aqua20,
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
});

const Playlist: FC<PlaylistProps> = ({ playlist }) => {
    const { images, genres = [] } = playlist;
    const [image] = images;
    const [first, second, third] = genres;

    const { css } = useFela<Theme>();

    const onButtonClick = () => {
        const a = document.createElement("a");
        a.href = playlist.externalUrl;
        a.target = "_black";

        a.click();
    };

    return (
        <section className={css(rootRules)}>
            <img src={image.url} className={css(coverRules)} />
            <section className={css(contentGroupRules)}>
                <Typography variant="headline4" weight={500}>
                    {playlist.name}
                </Typography>
                <Typography>
                    {playlist.description}, com{" "}
                    <strong>{playlist.tracks.total}</strong> músicas
                </Typography>
                <IF condition={genres.length > 0}>
                    <section className={css(genresGroupRules)}>
                        <Typography
                            className={css(genresRules)}
                            variant="caption"
                        >
                            {first.name}
                        </Typography>
                        <Typography
                            className={css(genresRules)}
                            variant="caption"
                        >
                            {second.name}
                        </Typography>
                        <Typography
                            className={css(genresRules)}
                            variant="caption"
                        >
                            {third.name}
                        </Typography>
                    </section>
                </IF>
            </section>
            <Button variant="ghost" onClick={onButtonClick} color="light">
                Abrir no Spotify
            </Button>
        </section>
    );
};

export default Playlist;
