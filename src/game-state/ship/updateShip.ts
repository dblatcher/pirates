import { _DEG, getDistance, getXYVector, isPointInsideRect } from "../../lib/geometry"
import { willShipHitOtherShip } from "../collisions"
import { isLandAt } from "../land"
import { Collison, DEFENCES_TO_REPEL_INVADERS, GameState, INVASION_RANGE, TOWN_SIZE } from "../model"
import { getSpeed } from "./calculate-speed"
import { getBoundingRect, getCollisionCircles, getProwPosition } from "./collision-shapes"
import { Ship } from "../model"
import { getTownShipIsInvading } from "../towns/town-functions"
import { updateCannon } from "../cannons"

// TO DO - vary by ship and crew
const SAIL_CHANGE_RATE = .01

const SHIP_TURN_RATE = _DEG * 2

export const updateShip = (ship: Ship, game: GameState, collisions: Collison[], pushLog: { (message: string): void }) => {
    const otherShipsNearby = game.ships
        .filter(shipInList => shipInList !== ship)
        .filter(shipInList => isPointInsideRect(ship, getBoundingRect(shipInList, ship.length + 2)))

    const moveAmount = getSpeed(ship, game)
    const forward = getXYVector(moveAmount, ship.h)
    const shipCopyAfterGoForward = { ...ship, x: ship.x + forward.x, y: ship.y + forward.y }
    const shipCirclesAfterGoForward = getCollisionCircles(shipCopyAfterGoForward)
    const prowAfterGoForward = getProwPosition(shipCopyAfterGoForward)

    // TO DO - can this test be based on the front collision circle of the moving ship, not all of them?
    // would be cheaper and should still work if ships never go fast enough to go through in a single cycle
    const otherShipRanInto = otherShipsNearby.find(otherShip => willShipHitOtherShip(shipCirclesAfterGoForward, otherShip))
    if (otherShipRanInto) {
        if (ship.speedLastTurn && ship.turnsUnimpeded >= 10) {
            collisions.push({
                ship,
                obstacle: otherShipRanInto,
                vector: forward,
                speedWhenHit: ship.speedLastTurn
            })
        }
    }

    const runsAgroundFromGoingForward = isLandAt(prowAfterGoForward, game.land)

    if (!otherShipRanInto && !runsAgroundFromGoingForward) {
        ship.x = ship.x += forward.x
        ship.y = ship.y += forward.y
    }

    // TO DO - turn more slowly with full sails
    const turnAmount = (SHIP_TURN_RATE * ship.wheel * ship.profile.maneuver)
    const newHeading = ship.h + turnAmount
    const shipCirclesAfterTurning = getCollisionCircles({ ...ship, h: newHeading })

    const otherShipTurnedInto = otherShipsNearby.find(otherShip => willShipHitOtherShip(shipCirclesAfterTurning, otherShip))
    if (!otherShipTurnedInto) {
        ship.h = newHeading
    }

    const wasNotImpeded = !otherShipRanInto && !runsAgroundFromGoingForward && !otherShipTurnedInto
    ship.speedLastTurn = wasNotImpeded ? moveAmount : 0
    ship.turnsUnimpeded = wasNotImpeded ? ship.turnsUnimpeded + 1 : 0

    if (ship.sailLevel !== ship.sailLevelTarget) {
        const change = Math.min(Math.abs(ship.sailLevel - ship.sailLevelTarget), SAIL_CHANGE_RATE) * -Math.sign(ship.sailLevel - ship.sailLevelTarget)
        ship.sailLevel = ship.sailLevel + change
    }
    ship.cannons.forEach(updateCannon)

    if (ship.launchingInvasion) {
        tryToLauchInvasion(ship, game, pushLog)
    }

}

function tryToLauchInvasion(ship: Ship, game: GameState, pushLog: (message: string) => void) {
    ship.launchingInvasion = false
    if (getTownShipIsInvading(ship, game.towns)) {
        pushLog(`${ship.name} is already invading a town`)
        return
    }
    // TO DO - what if multiple ships invade?
    const { towns } = game
    const town = towns.find(town => town.faction !== ship.faction && getDistance(ship, town) < (INVASION_RANGE + TOWN_SIZE))
    if (!town) {
        pushLog(`${ship.name} has no towns to invade`)
        return
    }
    if (town.defences > DEFENCES_TO_REPEL_INVADERS) {
        pushLog(`${ship.name} wants to invade ${town.name}, but its defenses are still up`)
        return
    }
    pushLog(`${ship.name} invading ${town.name}`)
    town.invasions.push({
        shipId: ship.id,
    })
}

