type Navy = "navy0" | "navy10" | "navy20" | "navy30" | "navy40";
type Aqua = "aqua0" | "aqua10" | "aqua20" | "aqua30" | "aqua40";
type Neutral =
    | "neutral0"
    | "neutral10"
    | "neutral20"
    | "neutral30"
    | "neutral40";

export type ColorKey = Navy | Aqua | Neutral;
type Pallette = Record<ColorKey, string>;

type ElevationKey = "level0" | "level1" | "level2" | "level3" | "level4";
type Elevation = Record<ElevationKey, { boxShadow: string }>;

type BreakpointKeys = "small" | "medium" | "large";
type Breakpoint = Record<BreakpointKeys, string>;

export interface Theme {
    pallette: Pallette;
    elevation: Elevation;
    breakpoint: Breakpoint;
}

const pallette: Pallette = {
    navy0: "#E6F7FF",
    navy10: "#6095b3",
    navy20: "#336B8C",
    navy30: "#124666",
    navy40: "#002740",

    aqua0: "#E6F9FF",
    aqua10: "#b8e9f4",
    aqua20: "#67d2df",
    aqua30: "#4fb9c6",
    aqua40: "#39a0ae",

    neutral0: "#ffffff",
    neutral10: "#e1e9ec",
    neutral20: "#abbdc8",
    neutral30: "#546c7e",
    neutral40: "#253746",
};

const elevation: Elevation = {
    level0: {
        boxShadow: "",
    },
    level1: {
        boxShadow: "0px 2px 4px rgba(171, 189, 200, 0.6)",
    },
    level2: {
        boxShadow: "0px 4px 12px rgba(171, 189, 200, 0.6)",
    },
    level3: {
        boxShadow: "0px 6px 20px rgba(171, 189, 200, 0.6)",
    },
    level4: {
        boxShadow: "0px 16px 32px rgba(171, 189, 200, 0.6)",
    },
};

const breakpoint: Breakpoint = {
    small: '@media (max-width: 480px)',
    medium: '@media (max-width: 800px)',
    large: '@media (max-width: 1024px)',
};

export const theme: Theme = {
    pallette,
    elevation,
    breakpoint,
};
