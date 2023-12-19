import { Ship, TOWN_SIZE, Town, ViewPort } from "../game-state";
import { FactionId, factions } from "../game-state/faction";
import { viewPortToRect } from "../game-state/helpers";
import { colors } from "../lib/Color";
import { XY, expandRect, isPointInsideRect } from "../lib/geometry";

export const s = (xy: XY): [number, number] => [xy.x, xy.y]

const lookUpFaction = (factionId?: FactionId) => factionId && factions[factionId]

export const getFactionColor = (townOrShip: Town | Ship) => {
    const faction = lookUpFaction(townOrShip.faction)
    return faction ? faction.color : colors.BLACK
}

export const flash = (gameCycle: number, colors: [string, string], period = 10): string =>
    gameCycle % (period * 2) > period ? colors[0] : colors[1]

export const isTownInView = (town: Town, viewPort: ViewPort): boolean => {
    const rect = expandRect(viewPortToRect(viewPort), TOWN_SIZE)
    return isPointInsideRect(town, rect)
}