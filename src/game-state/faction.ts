import { Flag } from "./model/game-types";
import { Color, colors } from "../lib/Color";

export type Faction = {
    name: string,
    color: Color,
    secondColor?: Color,
    townFlag: Flag,
}

const grance: Faction = {
    name: 'Grance',
    color: { r: 50, g: 100, b: 255 },
    secondColor: colors.WHITE,
    townFlag: {
        shape: 'cross', length: 42, height: 30
    }
};

const spaim: Faction = {
    name: 'Spaim',
    color: { r: 209, g: 188, b: 0 },
    secondColor: colors.RED,
    townFlag: {
        shape: 'stripe', length: 42, height: 30
    }
};

export const factions = {
    grance,
    spaim,
};

export type FactionId = keyof typeof factions;
