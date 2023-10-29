import { Ship } from "./types"
import { translate, getXYVector } from "../../lib/geometry"
import { launchProjectile } from "../projectile"
import { GameState } from "../types"

export const launchFromShip = (side: 'LEFT' | 'RIGHT', ship: Ship, game: GameState): boolean => {
    const coolDownKey = side === 'LEFT' ? 'cannonsCooldownLeft' : 'cannonsCooldownRight'

    if (ship[coolDownKey] > 0) {
        return false
    }

    const hh = side === 'LEFT' ? (-.5 * Math.PI) : (.5 * Math.PI)
    const directionOfFire = ship.h + hh

    const getStartAt = (distanceFromBroadsideCenter: number) => {
        const placeInMiddleOfShip = translate(ship, getXYVector(ship.length * distanceFromBroadsideCenter, ship.h))
        const placeOutFromShip = translate(placeInMiddleOfShip, getXYVector(1 + ship.width, directionOfFire))
        return {
            ...placeOutFromShip,
            h: directionOfFire
        }
    }

    //TO DO - any number
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
    ship[coolDownKey] = 200
    return true
}