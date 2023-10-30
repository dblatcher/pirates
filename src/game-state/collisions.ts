import { Circle, doCircleIntersect, getDistance, isPointInsideRect, translate, XY } from "../lib/geometry";
import { getBoundingRect, getCollisionCircles, Ship } from "./ship";
import { Projectile } from "./types";

export const willProjectileHitShip = (projectile: Projectile, ship: Ship): boolean => {

    if (!isPointInsideRect(projectile, getBoundingRect(ship))) {
        return false
    }

    const circles = getCollisionCircles(ship)
    if (circles.some(circle => getDistance(projectile, circle) < circle.r)) {
        return true
    }
    // IF projectiles never move fast enought to pass through a ship in one cycle, don't
    // need to check it they passed right through
    return false
}

export const willShipHitOtherShip = ( shipCirclesAfterMove: Circle[], otherShip: Ship): boolean => {
    const otherShipCircles = getCollisionCircles(otherShip)
    return shipCirclesAfterMove.some(
        shipCircle => otherShipCircles.some(
            otherShipCircle => doCircleIntersect(shipCircle, otherShipCircle)
        )
    )
}