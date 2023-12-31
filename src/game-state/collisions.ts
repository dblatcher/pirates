import { Circle, doCircleIntersect, getDistance, isPointInsideRect } from "../lib/geometry";
import { getBoundingRect, getCollisionCircles } from "./ship";
import { Projectile, TOWN_SIZE, Town, Ship, Fort, FORT_SIZE } from "./model";

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

export const willProjectileHitTown = (projectile: Projectile, town: Town): boolean => {
    return getDistance(projectile, { ...town }) < TOWN_SIZE / 2
}

export const willProjectileHitFort = (projectile: Projectile, fort: Fort): boolean => {
    return getDistance(projectile, fort) < FORT_SIZE / 2
}

export const willShipRunIntoOtherShip = (leadingCircleAfterMove: Circle, otherShip: Ship): boolean => {
    const otherShipCircles = getCollisionCircles(otherShip)
    return otherShipCircles.some(
        otherShipCircle => doCircleIntersect(leadingCircleAfterMove, otherShipCircle)
    )
}
export const willShipOverlapWithOtherShip = (shipCircles: Circle[], otherShip: Ship): boolean => {
    const otherShipCircles = getCollisionCircles(otherShip)
    return shipCircles.some(circle => {
        return otherShipCircles.some(
            otherShipCircle => doCircleIntersect(circle, otherShipCircle)
        )
    })
}

export const willShipRunIntoFort = (leadingCircleAfterMove: Circle, fort: Fort): boolean => {
    return doCircleIntersect(leadingCircleAfterMove, { ...fort, r: FORT_SIZE / 2 })
}
export const willShipOverlapWithFort = (shipCircles: Circle[], fort: Fort): boolean => {
    return shipCircles.some(circle => {
        return doCircleIntersect(circle, { ...fort, r: FORT_SIZE / 2 })
    })
}