import { AI, DescisonContext } from ".."
import { DEFAULT_FIRE_DISTANCE, Directive, Order } from "../../game-state"
import { followShip } from "../issue-directives/follow-ship"
import { turnToAndFire } from "../issue-directives/target-and-fire"


export const performHuntMission = (ai: AI, context: DescisonContext): Directive[] => {
    // NOTE - assumes the follower know where the target is regardless of distance
    const { ship: targetShip, distance: distanceToOtherShip } = ai.getCurrentTarget(context.ship, context.gameState.ships)

    if (!targetShip) {
        ai.debugLog(context.ship)(`Hunt Target ship#${ai.state.mission.targetShipId} is gone.`)
        return [
            { order: Order.SAILS_TO, quantity: 0 },
            { order: Order.RESET_WHEEL }
        ]
    }

    if (targetShip) {
        if (distanceToOtherShip > DEFAULT_FIRE_DISTANCE) {
            return followShip(ai, context, targetShip, distanceToOtherShip)
        }
        return [
            { order: Order.SAILS_TO, quantity: .5 },
            ...turnToAndFire(context, { target: targetShip, range: distanceToOtherShip })
        ]
    }

    return []
}