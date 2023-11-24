import { _90_DEG_RIGHT, getXYVector, translate } from "../../lib/geometry"
import { launchProjectile } from "."
import { DAMAGE_THAT_STOPS_FORTS_FIRING, FORT_SIZE, Fort, FortCannon, GameState, Town, anglesBySide } from "../model"
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

export const launchFromFort = (cannon: FortCannon, fort: Fort, town: Town, game: GameState): boolean => {
    if (cannon.cooldown > 0 || fort.damage >= DAMAGE_THAT_STOPS_FORTS_FIRING) {
        cannon.firing = false
        return false
    }
    const { aimDirection = 0, distanceFromTown } = fort

    const fortCenter = translate(town, distanceFromTown)

    const getStartAt = (distanceFromFortCenter: number) => {
        const d = (FORT_SIZE / 2) * distanceFromFortCenter
        const placeAlongDiameter = translate(fortCenter, getXYVector(d, _90_DEG_RIGHT + aimDirection))
        const placeOutsideRadius = translate(placeAlongDiameter, getXYVector(1 + FORT_SIZE / 2, aimDirection))
        return {
            ...placeOutsideRadius,
            h: aimDirection
        }
    }


    launchProjectile(getStartAt(cannon.position), game)
    cannon.cooldown = 200
    cannon.firing = false
    return true
}