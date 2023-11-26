import { getDistance } from "../../lib/geometry"
import { DEFENCES_TO_REPEL_INVADERS, GameState, INVASION_RANGE, TOWN_SIZE } from "../model"
import { Ship } from "../model/ship-types"
import { getTownShipIsInvading } from "../towns"


export function tryToLauchInvasion(ship: Ship, game: GameState, pushLog: (message: string) => void) {
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