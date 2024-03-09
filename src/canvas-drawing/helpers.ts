import { Flag, Ship, TOWN_SIZE, Town, ViewPort } from "../game-state";
import { FactionId, factions } from "../game-state/faction";
import { viewPortToRect } from "../game-state/helpers";
import { Color, colors } from "../lib/Color";
import { XY, expandRect, isPointInsideRect } from "../lib/geometry";

export const s = (xy: XY): [number, number] => [xy.x, xy.y]

const lookUpFaction = (factionId?: FactionId) => factionId && factions[factionId]

export const getFactionColor = (townOrShip: Town | Ship): Color => lookUpFaction(townOrShip.faction)?.color ?? colors.BLACK

export const getFactionSecondColor = (townOrShip: Town | Ship): Color => lookUpFaction(townOrShip.faction)?.secondColor ?? colors.WHITE
export const getFactionFlag = (townOrShip: Town | Ship): Flag => lookUpFaction(townOrShip.faction)?.townFlag ?? {
    shape: 'rectangle', length: 42, height: 30
}

export const flash = (gameCycle: number, colors: [string, string], period = 10): string =>
    gameCycle % (period * 2) > period ? colors[0] : colors[1]

export const isTownInView = (town: Town, viewPort: ViewPort): boolean => {
    const rect = expandRect(viewPortToRect(viewPort), TOWN_SIZE)
    return isPointInsideRect(town, rect)
}