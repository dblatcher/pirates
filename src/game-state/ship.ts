import { getXYVector, translate, XY } from "../lib/geometry"
import { launchProjectile } from "./projectile"
import { GameState } from "./types"

export type Ship = {
    x: number,
    y: number,
    h: number,
    width: number,
    length: number,
    sailLevel: number,
    sailLevelTarget: number,
    name?: string,
    // to do - model multiple cannons!
    cannonsCooldown: number,
}

// TO DO - vary by ship and crew
const SAIL_CHANGE_RATE = .01

export const updateShip = (ship: Ship) => {
    const forward = getXYVector(ship.sailLevel, ship.h)
    ship.x = ship.x += forward.x
    ship.y = ship.y += forward.y
    if (ship.sailLevel !== ship.sailLevelTarget) {
        const change = Math.min(Math.abs(ship.sailLevel - ship.sailLevelTarget), SAIL_CHANGE_RATE) * -Math.sign(ship.sailLevel - ship.sailLevelTarget)
        ship.sailLevel = ship.sailLevel + change
    }
    if (ship.cannonsCooldown > 0) {
        ship.cannonsCooldown = ship.cannonsCooldown - 1
    }
}

export const getCollisionCircles = (ship: Ship): Array<XY & { r: number }> => {
    const { x, y, width, h, length } = ship
    const r = width / 2
    const pointAlongMiddleAt = (distanceFromCentre: number) =>
        translate(getXYVector((length - width) * distanceFromCentre, h), { x, y })

    //TO DO - calculate the number of circles needed based on width & length 
    return [.5, .25, 0, -.25, -.5].map(pointAlongMiddleAt).map(point => ({ ...point, r }))
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