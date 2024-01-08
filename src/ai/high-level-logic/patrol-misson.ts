import { AI, DescisonContext } from ".."
import { Directive, TERRAIN_SQUARE_SIZE, DEFAULT_FIRE_DISTANCE, Order } from "../../game-state"
import { getDistance } from "../../lib/geometry"
import { identifyShips } from "../identify-ships"
import { approach } from "../issue-directives/approach"
import { followCurrentPath } from "../issue-directives/follow-path"
import { opportunisticFire } from "../issue-directives/opportunistic-fire"
import { turnToAndFire } from "../issue-directives/target-and-fire"


export const performPatrolMission = (ai: AI, context: DescisonContext): Directive[] => {
    const { ship, gameState } = context
    const { enemies } = identifyShips(ship, gameState)

    if (!ai.state.destination) {
        ai.setDestinationToCurrentWaypoint()
    }
    if (ai.state.destination && getDistance(ship, ai.state.destination) < TERRAIN_SQUARE_SIZE / 2) {
        ai.setDestinationToNextWaypoint()
    }

    const { ship: targetShip, distance: range } = ai.getCurrentTargetOrChooseClosest(ship, enemies)
    if (targetShip) {
        if (range > DEFAULT_FIRE_DISTANCE) {
            return [
                ...opportunisticFire(ai, context, enemies),
                ...approach(context, targetShip)
            ]
        }
        return [
            { order: Order.SAILS_TO, quantity: .5 },
            ...turnToAndFire(context, { target: targetShip, range })
        ]
    }

    if (!targetShip) {
        return followCurrentPath(ai, context)
    }

    return []
}