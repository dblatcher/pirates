import { getDistance } from "../../lib/geometry";
import { splitArray } from "../../lib/util";
import { updateCannon } from "../cannons";
import { Faction } from "../faction";
import { GameState, INVASION_RANGE, TOWN_SIZE, Town } from "../model";
import { doRepairs } from "./town-ai";
import { getInvasionsAndShips } from "./town-functions";

const REPAIR_PERIOD = 25
const BATTLE_PERIOD = 25

const conquerTown = (town: Town, faction?: Faction) => {
    town.faction = faction
    town.garrison = 1
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

            const [outOfRange, inRange] = splitArray(invasionsAndShips, invasion => getDistance(invasion.ship, town) > TOWN_SIZE + INVASION_RANGE)
            if (outOfRange.length) {
                console.log(outOfRange.map(_ => _.ship.name).join(), 'out of range')
            }

            town.invasions = inRange.map(_ => _.invasion)
            // TO DO - handle simulanteous invasions from rival factions!
            const [firstRemainingInvasion] = inRange
            if (!firstRemainingInvasion) {
                return
            }
            const invadingFaction = firstRemainingInvasion.ship.faction

            town.invasions.forEach(_invasion => {
                town.garrison = Math.max(town.garrison - 1, 0)
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
