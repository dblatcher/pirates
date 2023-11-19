import { expandRect, isPointInsideRect } from "../../lib/geometry";
import { viewPortToRect } from "../helpers";
import { ViewPort } from "../model/types";
import { Ship } from "./types";

export const isShipInView = (ship: Ship, viewPort: ViewPort): boolean => {
    const rect = expandRect(viewPortToRect(viewPort), ship.length)
    return isPointInsideRect(ship, rect)
}
