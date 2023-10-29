import { getXYVector, translate } from "../../lib/geometry"
import { willShipHitOtherShip } from "../collisions"
import { launchProjectile } from "../projectile"
import { Collison, GameState } from "../types"

import { Ship } from "./types"

export { followDirectives } from './followDirectives'
export type { Ship }
export * from './collision-shapes'

// TO DO - vary by ship and crew
const SAIL_CHANGE_RATE = .01

export const updateShip = (ship: Ship, game: GameState, collisions: Collison[]) => {
    const forward = getXYVector(ship.sailLevel, ship.h)
    // TO DO - need to do turning here and pass the change to the willShipHitOtherShip
    // function

    let hitAShip = false
    const otherShips = game.ships.filter(shipInList => shipInList !== ship)

    otherShips.forEach(otherShip => {
        if (willShipHitOtherShip(ship, forward, otherShip)) {
            collisions.push({ ship, obstacle: otherShip, vector: forward })
            hitAShip = true
        }
    })

    if (!hitAShip) {
        ship.x = ship.x += forward.x
        ship.y = ship.y += forward.y
    }

    if (ship.sailLevel !== ship.sailLevelTarget) {
        const change = Math.min(Math.abs(ship.sailLevel - ship.sailLevelTarget), SAIL_CHANGE_RATE) * -Math.sign(ship.sailLevel - ship.sailLevelTarget)
        ship.sailLevel = ship.sailLevel + change
    }
    if (ship.cannonsCooldownLeft > 0) {
        ship.cannonsCooldownLeft = ship.cannonsCooldownLeft - 1
    }
    if (ship.cannonsCooldownRight > 0) {
        ship.cannonsCooldownRight = ship.cannonsCooldownRight - 1
    }
}

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