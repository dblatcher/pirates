import { getXYVector, translate } from "../../lib/geometry"
import { launchProjectile } from "."
import { GameState, anglesBySide } from "../model"
import { ShipCannon, Ship } from "../model"


export const launchFromShip = (cannon: ShipCannon, ship: Ship, game: GameState): boolean => {
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