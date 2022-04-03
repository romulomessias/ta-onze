import { FC } from "react";
import { StyleFunction, useFela } from "react-fela";

import Typography from "components/typographies/Typography";
import { Playlist as PlaylistModel } from "infra/models/playlist/Playlist";
import { Theme } from "styles/Theme";

interface PlaylistItemProps {
    playlist: PlaylistModel;
}

const rootRules: StyleFunction<Theme> = ({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "max-content auto auto",
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
    width: "100%",

    ":hover": {
        "> img": {
            transform: "scale(1.04)",
        },
    },
});

const coverRules: StyleFunction<Theme> = ({ theme }) => ({
    borderRadius: 8,
    height: 96,
    width: 96,
    transition: "all 0.2s",

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

const PlaylistItem: FC<PlaylistItemProps> = ({ playlist }) => {
    const { images } = playlist;
    const [image] = images;

    const { css } = useFela<Theme>();

    return (
        <section className={css(rootRules)}>
            <img
                title="playlist cover"
                src={image.url}
                className={css(coverRules)}
            />
            <section className={css(contentGroupRules)}>
                <Typography variant="headline4" weight={500}>
                    {playlist.name}
                </Typography>
                <Typography>
                    {playlist.description},{" "}
                    <strong>{playlist.tracks.total}</strong> músicas
                </Typography>
            </section>
        </section>
    );
};

export default PlaylistItem;
