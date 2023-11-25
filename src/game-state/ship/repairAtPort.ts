import { getDistance } from "../../lib/geometry";
import { GameState, REPAIR_RANGE, Ship, TOWN_SIZE } from "../model";

export const shipIsAtPort = (ship: Ship, gameState: GameState): boolean => {

    return ship.sailLevel === 0
        && gameState.towns.some(town =>
            town.invasions.length === 0
            && town.faction === ship.faction
            && getDistance(ship, town) < TOWN_SIZE + REPAIR_RANGE
        )
}