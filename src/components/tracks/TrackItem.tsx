import { FC, useState } from "react";
import classNames from "classnames";
import { StyleFunction, useFela } from "react-fela";
import { TrackDetail } from "../../infra/models/playlist/Playlist";
import { Theme } from "../../styles/Theme";
import Typography from "../typographies/Typography";

const rootRules: StyleFunction<Theme> = ({ theme }) => ({
    padding: 8,
    paddingRight: 16,
    paddingLeft: 16,
    color: theme.pallette.neutral30,
    cursor: "default",
    listStyle: "none",
    display: "grid",
    gridAutoFlow: "column",
    justifyContent: "space-between",
    borderRight: "solid 2px transparent",
    height: 70,
    transition: "all 0.2s",

    [theme.breakpoint.small]: {
        gridAutoFlow: "row",
        gap: 8,
        height: "unset",
        gridAutoColumns: '1fr',

        "> .audio-wrapper": {
            justifySelf: "center",
        },
    },

    "&.playing": {
        borderRightColor: theme.pallette.aqua20 + "",
    },

    "> .audio-wrapper": {
        "> audio": {
            width: 180,
            display: "none",
            "::-webkit-media-controls-timeline": {
                display: "none",
            },
            "::-webkit-media-controls-enclosure": {
                width: 130,
            },

            "::-webkit-media-controls-volume-control-container": {
                display: "none",
            },
        },
    },

    ":hover": {
        position: "relative",
        zIndex: 10,
        "> .audio-wrapper": {
            "> audio": {
                display: "block",
            },
        },
        ...theme.elevation.level3,
    },
});

interface TrackItemProps {
    track: TrackDetail;
}

const TrackItem: FC<TrackItemProps> = ({ track }) => {
    const { css } = useFela<Theme>();
    const [isPlaying, setIsPlaying] = useState(false);

    const handleOnPlay = () => setIsPlaying(true);
    const handleOnEndedOrPause = () => setIsPlaying(false);

    const rootClassNames = classNames(css(rootRules), {
        [`playing`]: isPlaying,
    });

    return (
        <li className={rootClassNames}>
            <section>
                <Typography as="h3" weight={500} color={"navy40"}>
                    {track.name}
                </Typography>
                <Typography variant="caption">
                    {track.artists.map((artist) => artist.name).join(", ")}
                </Typography>
            </section>
            <div className="audio-wrapper">
                <audio
                    onEnded={handleOnEndedOrPause}
                    onPause={handleOnEndedOrPause}
                    onPlay={handleOnPlay}
                    src={track.preview_url}
                    controlsList="nodownload"
                    controls
                />
            </div>
        </li>
    );
};

export default TrackItem;
