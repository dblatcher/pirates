import { Ship, TOWN_SIZE, Town, ViewPort } from "../game-state";
import { viewPortToRect } from "../game-state/helpers";
import { colors, rgb } from "../lib/Color";
import { XY, expandRect, isPointInsideRect } from "../lib/geometry";

export const s = (xy: XY): [number, number] => [xy.x, xy.y]

export const shipColor = (ship: Ship) => ship.faction ? rgb(ship.faction.color) : 'black'
export const getTownColor = (town: Town) => town.faction ? town.faction.color : colors.BLACK

export const flash = (gameCycle: number, colors: [string, string], period = 10): string =>
    gameCycle % (period * 2) > period ? colors[0] : colors[1]

export const isTownInView = (town: Town, viewPort: ViewPort): boolean => {
    const rect = expandRect(viewPortToRect(viewPort), TOWN_SIZE)
    return isPointInsideRect(town, rect)
}