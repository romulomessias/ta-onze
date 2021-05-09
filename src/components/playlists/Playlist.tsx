import { FC } from "react";
import { StyleFunction, useFela } from "react-fela";
import { PlaylistItem } from "../../infra/models/spotify/SpotifyPlaylist";
import { Theme } from "../../styles/Theme";
import Button from "../buttons/Button";
import Typography from "../typographies/Typography";

interface PlaylistProps {
    playlist: PlaylistItem;
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
        gap: 16,
    },
});

const coverRules: StyleFunction<Theme> = ({ theme }) => ({
    borderRadius: 8,
    height: 172,
    width: 172,

    [theme.breakpoint.small]: {
        justifySelf:  "center",
        width: "100%",
        objectFit: "cover"
    },

    ...theme.elevation.level2,
});

const Playlist: FC<PlaylistProps> = ({ playlist }) => {
    const [image] = playlist.images;
    const { css } = useFela<Theme>();

    const onButtonClick = () => {
        const a = document.createElement("a");
        a.href = playlist.external_urls.spotify;
        a.target = "_black";

        a.click();
    };

    return (
        <section className={css(rootRules)}>
            <img src={image.url} className={css(coverRules)} />
            <section>
                <Typography variant="headline4" weight={500}>
                    {playlist.name}
                </Typography>
                <Typography>
                    {playlist.description} Com{" "}
                    <strong>{playlist.tracks.total}</strong> músicas
                </Typography>
            </section>
            <Button variant="ghost" onClick={onButtonClick} color="light">
                Abrir no Spotify
            </Button>
        </section>
    );
};

export default Playlist;
