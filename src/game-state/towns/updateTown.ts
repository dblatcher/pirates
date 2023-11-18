import { _DEG } from "../../lib/geometry";
import { GameState, Town } from "../types";

const REPAIR_PERIOD = 25

export const updateTown = (town: Town, gameState: GameState) => {

    if (gameState.cycleNumber % REPAIR_PERIOD === 0) {
        if (town.defences < town.profile.maxDefences) {
            town.defences = town.defences + 1
        }
    }
}
