import { Circle, Rect, getXYVector, translate } from "typed-geometry";
import { Ship } from "../model";

const pointAlongMiddleAtOf = ({ length, width, x, y, h }: Ship) => (distanceFromCentre: number) => translate(getXYVector((length - width) * distanceFromCentre, h), { x, y });

export const getCollisionCircles = (ship: Ship): Circle[] => {
    const pointAlongMiddleAt = pointAlongMiddleAtOf(ship)
    //TO DO - calculate the number of circles needed based on width & length 
    return [0.5, 0.25, 0, -0.25, -0.5].map(pointAlongMiddleAt).map(point => ({ ...point, r: ship.width / 2 }));
};

export const getFrontCollisionCircle = (ship: Ship): Circle => {
    return { ...pointAlongMiddleAtOf(ship)(.5), r: ship.width / 2 }
}

export const getRearCollisionCircle = (ship: Ship): Circle => {
    return { ...pointAlongMiddleAtOf(ship)(-.5), r: ship.width / 2 }
}

export const getBoundingRect = (ship: Ship, margin = 6): Rect => {
    const zoneSize = margin + ship.length / 2;
    const top = ship.y - zoneSize;
    const bottom = ship.y + zoneSize;
    const left = ship.x - zoneSize;
    const right = ship.x + zoneSize;
    return { top, bottom, left, right };
};

export const getProwPosition = (ship: Ship) => translate(ship, getXYVector(ship.length / 2, ship.h))
export const getAftPosition = (ship: Ship) => translate(ship, getXYVector(-ship.length / 2, ship.h))
