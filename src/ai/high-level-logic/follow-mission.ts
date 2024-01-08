import { AI } from "../base-class"
import { Directive, Order } from "../../game-state"
import { followShip } from "../issue-directives/follow-ship"
import { DescisonContext } from "../types"


export const performFollowMission = (ai: AI, context: DescisonContext): Directive[] => {
    // NOTE - assumes the follower knows where the target is regardless of distance
    const { ship: shipToFollow, distance: distanceToOtherShip } = ai.getCurrentTarget(context.ship, context.gameState.ships)

    if (!shipToFollow) {
        ai.debugLog(`Follow Target ship#${ai.state.mission.targetShipId} is gone.`)
        return [
            { order: Order.SAILS_TO, quantity: 0 },
            { order: Order.RESET_WHEEL }
        ]
    }
    // TO DO - attack enemies near shipToFollow
    return followShip(ai, context, shipToFollow, distanceToOtherShip)
}