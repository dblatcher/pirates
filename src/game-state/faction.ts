import { Color } from "../lib/Color";

export type Faction = {
    name: string,
    color: Color,
}

const grance: Faction = {
    name: 'Grance',
    color: { r: 50, g: 100, b: 255 },
};

const spaim: Faction = {
    name: 'Spaim',
    color: { r: 250, g: 100, b: 55 },
};

export const factions = {
    grance,
    spaim,
};

export type FactionId = keyof typeof factions;
