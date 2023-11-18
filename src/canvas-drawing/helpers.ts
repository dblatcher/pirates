import { Ship, Town } from "../game-state/types";
import { colors, rgb } from "../lib/Color";
import { XY } from "../lib/geometry";

export const s = (xy: XY): [number, number] => [xy.x, xy.y]

export const shipColor = (ship: Ship) => ship.faction ? rgb(ship.faction.color) : 'black'
export const getTownColor = (town: Town) => town.faction ? town.faction.color : colors.BLACK