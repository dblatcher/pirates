import { getCollisionCircles } from "./ship";
import { Projectile, Ship } from "./types";
import { getDistance } from "../lib/geometry";


const isWithinBoundingRect = (projectile: Projectile, ship: Ship): boolean => {
    // assumption - ship is never wider than it is long
    // 6 is twice the current projectile speed
    const zoneSize = 6 + ship.length / 2
    const top = ship.y - zoneSize;
    const bottom = ship.y + zoneSize;
    const left = ship.x - zoneSize;
    const right = ship.x + zoneSize;

    return !(
        projectile.y < top ||
        projectile.y > bottom ||
        projectile.x < left ||
        projectile.x > right
    )
}

export const willProjectileHitShip = (projectile: Projectile, ship: Ship): boolean => {
    if (!isWithinBoundingRect(projectile, ship)) {
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