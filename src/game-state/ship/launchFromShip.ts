import { Ship } from "./types"
import { translate, getXYVector, _90_DEG_LEFT, _90_DEG_RIGHT } from "../../lib/geometry"
import { launchProjectile } from "../projectile"
import { GameState } from "../types"

export const launchFromShip = (side: 'LEFT' | 'RIGHT', ship: Ship, game: GameState): boolean => {
    const cannon = ship.cannons.find(cannon => cannon.side == side)
    if (!cannon) {
        return false
    }

    if (cannon.cooldown > 0) {
        cannon.firing = false
        return false
    }

    const hh = side === 'LEFT' ? _90_DEG_LEFT : _90_DEG_RIGHT
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
    cannon.cooldown = 200
    cannon.firing = false
    return true
}