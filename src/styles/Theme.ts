type Navy = "navy0" | "navy10" | "navy20" | "navy30" | "navy40";
type Aqua = "aqua0" | "aqua10" | "aqua20" | "aqua30" | "aqua40";

export type ColorKey = Navy | Aqua;
type Pallette = Record<ColorKey, string>;

export interface Theme {
    pallette: Pallette;
}

const pallette: Pallette = {
    navy0: "#E6F7FF",
    navy10: "#002740",
    navy20: "#336B8C",
    navy30: "#124666",
    navy40: "#002740",

    aqua0: "#E6F9FF",
    aqua10: "#b8e9f4",
    aqua20: "##67d2df",
    aqua30: "##4fb9c6",
    aqua40: "##39a0ae",
};

export const theme: Theme = {
    pallette,
};
