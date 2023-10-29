import { doCircleIntersect, getDistance, isPointInsideRect, translate, XY } from "../lib/geometry";
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

// TO DO - allow for could turn, but not go forward and vice-versa
export const willShipHitOtherShip = (ship: Ship, forward: XY, otherShip: Ship): boolean => {
    if (!isPointInsideRect(ship, getBoundingRect(otherShip, ship.length + 2))) {
        return false
    }

    // TO DO - allow for turning!
    // TO DO - running the map on every iteration - do once and make it an argument
    const shipCircles = getCollisionCircles(ship)
    const shipCirclesAfterMove = shipCircles.map(c => ({ ...translate(c, forward), r: c.r }))

    const otherShipCircles = getCollisionCircles(otherShip)
    return shipCirclesAfterMove.some(
        shipCircle => otherShipCircles.some(
            otherShipCircle => doCircleIntersect(shipCircle, otherShipCircle)
        )
    )
}