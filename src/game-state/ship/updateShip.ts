import { getXYVector, isPointInsideRect } from "../../lib/geometry"
import { willShipHitOtherShip } from "../collisions"
import { isLandAt } from "../land"
import { Collison, GameState } from "../types"
import { getBoundingRect, getCollisionCircles, getProwPosition } from "./collision-shapes"
import { Ship } from "./types"

// TO DO - vary by ship and crew
const SAIL_CHANGE_RATE = .01

const SHIP_TURN_RATE = Math.PI * 0.05

export const updateShip = (ship: Ship, game: GameState, collisions: Collison[]) => {
    const otherShipsNearby = game.ships
        .filter(shipInList => shipInList !== ship)
        .filter(shipInList => isPointInsideRect(ship, getBoundingRect(shipInList, ship.length + 2)))

    // TO DO - adjust by wind
    const moveAmount = ship.sailLevel * ship.profile.speed
    const forward = getXYVector(moveAmount, ship.h)
    const shipCopyAfterGoForward = { ...ship, x: ship.x + forward.x, y: ship.y + forward.y }
    const shipCirclesAfterGoForward = getCollisionCircles(shipCopyAfterGoForward)
    const prowAfterGoForward = getProwPosition(shipCopyAfterGoForward)

    let hitAnotherShipFromGoingForward = false
    otherShipsNearby.forEach(otherShip => {
        if (willShipHitOtherShip(shipCirclesAfterGoForward, otherShip)) {
            collisions.push({ ship, obstacle: otherShip, vector: forward })
            hitAnotherShipFromGoingForward = true
        }
    })

    const runsAgroundFromGoingForward = isLandAt(prowAfterGoForward, game.land)

    if (!hitAnotherShipFromGoingForward && !runsAgroundFromGoingForward) {
        ship.x = ship.x += forward.x
        ship.y = ship.y += forward.y
    }

    // TO DO - turn more slowly with full sails
    const turnAmount = (SHIP_TURN_RATE * ship.wheel * ship.profile.maneuver)
    const newHeading = ship.h + turnAmount
    const shipCirclesAfterTurning = getCollisionCircles({ ...ship, h: newHeading })
    let hitAnotherShipFromTurning = false
    otherShipsNearby.forEach(otherShip => {
        if (willShipHitOtherShip(shipCirclesAfterTurning, otherShip)) {
            // collisions.push({ ship, obstacle: otherShip, vector: forward })
            hitAnotherShipFromTurning = true
        }
    })


    if (!hitAnotherShipFromTurning) {
        ship.h = newHeading
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
