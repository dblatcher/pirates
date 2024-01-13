import { Directive, Order } from "../../game-state"
import { AI } from "../base-class"
import { followShip } from "../issue-directives/follow-ship"
import { opportunisticFire } from "../issue-directives/opportunistic-fire"
import { DescisonContext } from "../types"


export const performFollowMission = (ai: AI, context: DescisonContext): Directive[] => {
    // NOTE - assumes the follower knows where the target is regardless of distance
    const { ship: shipToFollow, distance: distanceToOtherShip } = ai.getCurrentTarget(context.ship, context.gameState.ships)

    const ship = context.gameState.ships.find(ship => ship.id === ai.shipId)
    if (!ship) {
        ai.debugLog('no such ship!')
        return []
    }

    if (!shipToFollow) {
        ai.debugLog(`Follow Target ship#${ai.state.mission.targetShipId} is gone.`)
        return [
            { order: Order.SAILS_TO, quantity: 0 },
            { order: Order.RESET_WHEEL }
        ]
    }
    // TO DO - attack enemies near shipToFollow
    return [
        ...followShip(ai, context, shipToFollow, distanceToOtherShip),
        ...opportunisticFire(ai, context)
    ]
}