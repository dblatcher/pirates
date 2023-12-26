import { getDistance } from "../../lib/geometry";
import { splitArray } from "../../lib/util";
import { updateCannon } from "../cannons";
import { FactionId } from "../faction";
import { BATTLE_PERIOD, GameState, INVASION_RANGE, REPAIR_PERIOD, TOWN_SIZE, Town } from "../model";
import { doRepairs } from "./town-ai";
import { getInvasionsAndShips } from "./town-functions";

const conquerTown = (town: Town, faction?: FactionId) => {
    // TO DO - if the invasions are for another faction, keep invading?
    const totalTroops = town.invasions.reduce<number>((total, nextInvasion) => total + nextInvasion.landingParty, 0)
    town.faction = faction
    town.garrison = totalTroops
    town.invasions = []
}


// TO DO - will it be necesary to run this every cycle?
export const updateTown = (town: Town, gameState: GameState) => {
    if (town.invasions.length === 0) {
        if (gameState.cycleNumber % REPAIR_PERIOD === 0) {
            doRepairs(town)
        }
    } else {
        // will filter out invasions by dead ships as no longer in gameState.

        if (gameState.cycleNumber % BATTLE_PERIOD === 0) {
            const invasionsAndShips = getInvasionsAndShips(town, gameState.ships)

            const [_invasionsOver, invasionsStillGoingOn] = splitArray(invasionsAndShips, invasionAndShip =>
                invasionAndShip.invasion.landingParty <= 1 ||
                getDistance(invasionAndShip.ship, town) > TOWN_SIZE + INVASION_RANGE
            )

            town.invasions = invasionsStillGoingOn.map(_ => _.invasion)
            // TO DO - handle simulanteous invasions from rival factions!
            const [firstRemainingInvasion] = invasionsStillGoingOn
            if (!firstRemainingInvasion) {
                return
            }
            const invadingFaction = firstRemainingInvasion.ship.faction

            town.invasions.forEach(invasion => {
                town.garrison = Math.max(town.garrison - 1, 0)
                invasion.landingParty = invasion.landingParty - 1
            })

            if (town.garrison <= 0) {
                conquerTown(town, invadingFaction)
                // TO DO - add a nice visual effect 
            }
        }
    }

    town.forts.forEach(fort => {
        fort.cannons.forEach(updateCannon)
    })
}
