import { FC } from "react";
import { StyleFunction, useFela } from "react-fela";

import TrackItem from "components/tracks/TrackItem";
import { Tracks } from "infra/models/playlist/Playlist";
import { Theme } from "styles/Theme";

const rootRules: StyleFunction<Theme> = ({ theme }) => ({
    backgroundColor: theme.pallette.neutral0,
    color: theme.pallette.navy10,
    position: "relative",
    display: "grid",
    gap: 4,
    padding: 0,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 12,
});

interface TrackSectionProps {
    tracks: Tracks;
}

const TrackSection: FC<TrackSectionProps> = ({ tracks }) => {
    const { css } = useFela<Theme>();
    return (
        <ul className={css(rootRules)}>
            {tracks.items.map((item) => (
                <TrackItem key={item.track.id} track={item.track} />
            ))}
        </ul>
    );
};

export default TrackSection;
