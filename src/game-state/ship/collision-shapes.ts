import { getXYVector, Rect, translate, Circle } from "../../lib/geometry";
import { Ship } from "./types";

export const getCollisionCircles = (ship: Ship): Circle[] => {
    const { x, y, width, h, length } = ship;
    const r = width / 2;
    const pointAlongMiddleAt = (distanceFromCentre: number) => translate(getXYVector((length - width) * distanceFromCentre, h), { x, y });

    //TO DO - calculate the number of circles needed based on width & length 
    return [0.5, 0.25, 0, -0.25, -0.5].map(pointAlongMiddleAt).map(point => ({ ...point, r }));
};

export const getBoundingRect = (ship: Ship, margin = 6): Rect => {
    const zoneSize = margin + ship.length / 2;
    const top = ship.y - zoneSize;
    const bottom = ship.y + zoneSize;
    const left = ship.x - zoneSize;
    const right = ship.x + zoneSize;
    return { top, bottom, left, right };
};

export const getProwPosition = (ship: Ship) => translate(ship, getXYVector(ship.length / 2, ship.h))
