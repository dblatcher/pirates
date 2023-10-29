import { getXYVector } from "../../lib/geometry"
import { willShipHitOtherShip } from "../collisions"
import { Collison, GameState } from "../types"
import { Ship } from "./types"

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
    ship.cannons.forEach(cannon => {
        if (cannon.cooldown > 0) {
            cannon.cooldown = cannon.cooldown - 1
        }
    })
}
