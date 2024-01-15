import { AI, DescisonContext } from "..";
import { Directive, TERRAIN_SQUARE_SIZE } from "../../game-state";
import { getDistance } from "../../lib/geometry";
import { followCurrentPath } from "../issue-directives/follow-path";
import { opportunisticFire } from "../issue-directives/opportunistic-fire";


export const performTravelMission = (ai: AI, context: DescisonContext): Directive[] => {


    if (!ai.state.destination) {
        ai.setDestinationToCurrentWaypoint()
    }
    if (ai.state.destination && getDistance(context.ship, ai.state.destination) < TERRAIN_SQUARE_SIZE / 2) {
        ai.setDestinationToNextWaypoint()
    }

    return [
        ...opportunisticFire(ai, context),
        ...followCurrentPath(ai, context)
    ]

}