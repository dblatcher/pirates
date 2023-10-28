import { getXYVector, translate } from "../lib/geometry"
import { launchProjectile } from "./projectile"
import { GameState } from "./types"

export type Ship = {
    x: number,
    y: number,
    h: number,
    width: number,
    length: number,
    sailLevel: number,
    name?: string,
    // to do - model multiple cannons!
    cannonsCooldown: number,
}

export const updateShip = (ship: Ship) => {
    const forward = getXYVector(ship.sailLevel, ship.h)
    ship.x = ship.x += forward.x
    ship.y = ship.y += forward.y

    if (ship.cannonsCooldown > 0) {
        ship.cannonsCooldown = ship.cannonsCooldown - 1
    }
}

export const launchFromShip = (relativeH: number, ship: Ship, game: GameState): boolean => {
    if (ship.cannonsCooldown > 0) {
        return false
    }
    const directionOfFire = ship.h + relativeH

    const getStartAt = (distanceFromBroadsideCenter: number) => {
        const placeInMiddleOfShip = translate(ship, getXYVector(ship.length * distanceFromBroadsideCenter, ship.h))
        const placeOutFromShip = translate(placeInMiddleOfShip, getXYVector(1 + ship.width, directionOfFire))
        return {
            ...placeOutFromShip,
            h: directionOfFire
        }
    }

    const startPositions = [
        getStartAt(-1 / 4),
        getStartAt(0),
        getStartAt(1 / 4),
    ]

    startPositions.forEach(start => {
        launchProjectile({
            x: start.x,
            y: start.y,
            h: directionOfFire
        }, game)
    })
    ship.cannonsCooldown = 200
    return true
}