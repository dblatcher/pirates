import { describeShipWithId, isBeingBoarded, isBoarding } from "."
import { identifyShips } from "../../ai/identify-ships"
import { findClosestAndDistance, getDistance } from "../../lib/geometry"
import { startBoardingAction } from "../melee"
import { DEFENCES_TO_REPEL_INVADERS, GameState, INVASION_RANGE, TOWN_SIZE } from "../model"
import { Ship } from "../model/ship-types"
import { getTownShipIsInvading } from "../towns"


export function tryToLauchInvasion(ship: Ship, game: GameState, pushLog: (message: string) => void) {
    ship.launchingInvasion = false
    if (getTownShipIsInvading(ship, game)) {
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
    pushLog(`${ship.name} invading ${town.name} with ${ship.marines} marines`)
    game.invadingActions.push({
        boardingParty: ship.marines,
        boardingShipId: ship.id,
        townId: town.id,
        resolved: false,
    })
    ship.marines = 0
}

export function tryToBoardShip(ship: Ship, game: GameState, pushLog: (message: string) => void) {
    ship.boardingShip = false
    if (isBoarding(ship, game)) {
        pushLog(`${describeShipWithId(ship)} is already boarding a ship`)
        return
    }
    const { enemies } = identifyShips(ship, game, INVASION_RANGE + ship.width)
    const { item: closestEnemy, distance } = findClosestAndDistance(enemies, ship)
    if (!closestEnemy) {
        pushLog(`There are no enemies in range of ${ship.name}`)
        return
    }
    pushLog(`${describeShipWithId(closestEnemy)} is the closest, ${distance.toFixed(0)} away.`)
    if (isBeingBoarded(closestEnemy, game)) {
        pushLog(`${describeShipWithId(closestEnemy)} is already being boarded.`)
    }
    pushLog(`${describeShipWithId(ship)} boards ${describeShipWithId(closestEnemy)}.`)

    startBoardingAction(ship, closestEnemy, game)
}

