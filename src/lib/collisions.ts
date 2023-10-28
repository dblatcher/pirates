import { getProjectilesNextPosition } from "../game-state/projectile";
import { getCollisionCircles } from "../game-state/ship";
import { Projectile, Ship } from "../game-state/types";
import { getDistance } from "./geometry";


export const willProjectileHitShip = (projectile: Projectile, ship: Ship): boolean => {

    // TO DO - check if outside bounding collision rectile for the ship 
    // to avoid more expensive checks

    const circles = getCollisionCircles(ship)
    if (circles.some(circle => getDistance(projectile, circle) < circle.r)) {
        return true
    }
    // ONLY NEED TO NO THIS IF porjectiles can move fast enought to go right through a ship
    // in one cycle
    // TO DO - test if the next position will collide
    // TO DO - test if the project position after moving is 
    // on the other side of the ship - IE passed through
    return false
}