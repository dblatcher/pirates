import { AI, DescisonContext } from "..";
import { DEFAULT_FIRE_DISTANCE, Directive, TERRAIN_SQUARE_SIZE } from "../../game-state";
import { getDistance } from "../../lib/geometry";
import { identifyShips } from "../identify-ships";
import { followCurrentPath } from "../issue-directives/follow-path";
import { opportunisticFire } from "../issue-directives/opportunistic-fire";


export const performTravelMission = (ai: AI, context: DescisonContext): Directive[] => {

    const { enemies, allies } = identifyShips(context.ship, context.gameState, DEFAULT_FIRE_DISTANCE)

    if (!ai.state.destination) {
        ai.setDestinationToCurrentWaypoint()
    }
    if (ai.state.destination && getDistance(context.ship, ai.state.destination) < TERRAIN_SQUARE_SIZE / 2) {
        ai.setDestinationToNextWaypoint()
    }

    return [
        ...opportunisticFire(ai, context, enemies, allies),
        ...followCurrentPath(ai, context)
    ]

}