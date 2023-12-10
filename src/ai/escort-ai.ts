import { AI, DescisonContext } from ".";
import { Directive, Order } from "../game-state";
import { followShip } from "./issue-directives/follow-ship";


export class EscortAutoPilot extends AI {

    issueDirectives(context: DescisonContext): Directive[] {

        // NOTE - assumes the escort know where the target is regardless of distance
        const { ship: shipToFollow, distance: distanceToOtherShip } = this.getCurrentTarget(context.ship, context.gameState.ships)

        if (!shipToFollow) {
            this.debugLog(`Escort Target ship#${this.state.mission.targetShipId} is gone.`)
            return [
                { order: Order.SAILS_TO, quantity: 0 },
                { order: Order.RESET_WHEEL }
            ]
        }

        // TO DO - attack enemies near shipToFollow
        return followShip(this, context, shipToFollow, distanceToOtherShip)

    }
}

