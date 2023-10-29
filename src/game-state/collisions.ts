import { getBoundingRect, getCollisionCircles } from "./ship";
import { Projectile, Ship } from "./types";
import { getDistance, isPointInsideRect } from "../lib/geometry";

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