import { expandRect, isPointInsideRect } from "../../lib/geometry";
import { viewPortToRect } from "../helpers";
import { ViewPort } from "../model";
import { Ship } from "../model";

export const isShipInView = (ship: Ship, viewPort: ViewPort): boolean => {
    const rect = expandRect(viewPortToRect(viewPort), ship.length)
    return isPointInsideRect(ship, rect)
}

export const describeShipWithId = (ship: Ship) => ship.name ? `${ship.name}(#${ship.id})` : `SHIP#${ship.id}`