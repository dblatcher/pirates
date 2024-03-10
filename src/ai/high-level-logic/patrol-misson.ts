import { AI, DescisonContext } from ".."
import { DEFAULT_ATTACK_RANGE, DEFAULT_FIRE_DISTANCE, Directive, Order, TERRAIN_SQUARE_SIZE } from "../../game-state"
import { getDistance } from "../../lib/geometry"
import { identifyShips } from "../identify-ships"
import { approachOrFindIndirectPathUnlessBlocked } from "../issue-directives/approach"
import { followCurrentPath } from "../issue-directives/follow-path"
import { opportunisticFire } from "../issue-directives/opportunistic-fire"
import { turnToAndFire } from "../issue-directives/target-and-fire"


export const performPatrolMission = (ai: AI, context: DescisonContext): Directive[] => {
    const { ship, gameState } = context
    const { enemies, allies } = identifyShips(ship, gameState, DEFAULT_ATTACK_RANGE)

    if (!ai.state.destination) {
        ai.setDestinationToCurrentWaypoint(context)
    }
    if (ai.state.destination && getDistance(ship, ai.state.destination) < TERRAIN_SQUARE_SIZE / 2) {
        ai.setDestinationToNextWaypoint(context)
    }

    const { ship: targetShip, distance: range } = ai.getCurrentTargetOrChooseClosest(ship, enemies)
    if (targetShip) {
        if (range > DEFAULT_FIRE_DISTANCE) {
            return [
                ...opportunisticFire(ai, context, { enemies, allies }), // will include ships outside fire range
                ...approachOrFindIndirectPathUnlessBlocked(ai, context, targetShip)
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