import { getDistance } from "typed-geometry";
import { GameState, REPAIR_RANGE, Ship, TOWN_SIZE } from "../model";

export const shipIsAtPort = (ship: Ship, gameState: GameState): boolean => {

    return ship.sailLevel === 0
        && gameState.towns.some(town =>
            town.faction === ship.faction
            && gameState.invadingActions.every(action => action.townId !== town.id)
            && getDistance(ship, town) < TOWN_SIZE + REPAIR_RANGE
        )
}