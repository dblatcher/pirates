import { AI } from ".";
import { Directive, GameState, Order, Ship } from "../game-state";
import { CellMatrix } from "../lib/path-finding/types";
import { followShip } from "./issue-directives/follow-ship";


export class EscortAutoPilot extends AI {

    issueDirectives(ship: Ship, gameState: GameState, matrix: CellMatrix): Directive[] {

        // NOTE - assumes the escort know where the target is regardless of distance
        const { ship: shipToFollow, distance: distanceToOtherShip } = this.getCurrentTarget(ship, gameState.ships)

        if (!shipToFollow) {
            this.debugLog(`Escort Target ship#${this.state.mission.targetShipId} is gone.`)
            return [
                { order: Order.SAILS_TO, quantity: 0 },
                { order: Order.RESET_WHEEL }
            ]
        }

        // TO DO - attack enemies near shipToFollow
        return followShip(this, ship, shipToFollow, distanceToOtherShip, gameState, matrix)

    }
}

