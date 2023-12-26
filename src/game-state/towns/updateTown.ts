import { updateCannon } from "../cannons";
import { GameState, REPAIR_PERIOD, Town } from "../model";
import { doRepairs } from "./town-ai";
import { townIsBeingInvaded } from "./town-functions";


// TO DO - will it be necesary to run this every cycle?
export const updateTown = (town: Town, gameState: GameState) => {
    if (!townIsBeingInvaded(town, gameState)) {
        if (gameState.cycleNumber % REPAIR_PERIOD === 0) {
            doRepairs(town)
        }
    } 
    town.forts.forEach(fort => {
        fort.cannons.forEach(updateCannon)
    })
}
