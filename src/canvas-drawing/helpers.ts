import { Ship } from "../game-state/types";
import { rgb } from "../lib/Color";
import { XY } from "../lib/geometry";

export const s = (xy: XY): [number, number] => [xy.x, xy.y]

export const shipColor = (ship: Ship) => ship.faction ? rgb(ship.faction.color) : 'black' 