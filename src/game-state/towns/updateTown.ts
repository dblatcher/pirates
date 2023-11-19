import { _DEG } from "../../lib/geometry";
import { GameState, Town } from "../model/types";
import { getInvadingShips } from "./town-functions";

const REPAIR_PERIOD = 25

export const updateTown = (town: Town, gameState: GameState) => {
    const invadingShips = getInvadingShips(town, gameState.ships)

    if (invadingShips.length === 0) {
        if (gameState.cycleNumber % REPAIR_PERIOD === 0) {
            if (town.defences < town.profile.maxDefences) {
                town.defences = town.defences + 1
            }
        }
    }
}
