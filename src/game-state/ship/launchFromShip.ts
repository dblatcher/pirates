import { getXYVector, translate } from "../../lib/geometry"
import { launchProjectile } from "../projectile"
import { GameState, anglesBySide } from "../model"
import { Cannon, Ship } from "../model"


export const launchFromShip = (cannon: Cannon, ship: Ship, game: GameState): boolean => {
    if (cannon.cooldown > 0) {
        cannon.firing = false
        return false
    }

    const directionOfFire = ship.h + anglesBySide[cannon.side]

    const getStartAt = (distanceFromBroadsideCenter: number) => {
        const placeInMiddleOfShip = translate(ship, getXYVector(ship.length * distanceFromBroadsideCenter, ship.h))
        const placeOutFromShip = translate(placeInMiddleOfShip, getXYVector(1 + ship.width, directionOfFire))
        return {
            ...placeOutFromShip,
            h: directionOfFire
        }
    }


    launchProjectile(getStartAt(cannon.position), game)
    cannon.cooldown = 200
    cannon.firing = false
    return true
}