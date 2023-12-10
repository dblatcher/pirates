import { AI, DescisonContext } from ".";
import { DEFAULT_FIRE_DISTANCE, Directive, Order, TERRAIN_SQUARE_SIZE } from "../game-state";
import { getDistance } from "../lib/geometry";
import { identifyShips } from "./identify-ships";
import { approach } from "./issue-directives/approach";
import { followCurrentPath } from "./issue-directives/follow-path";
import { turnToAndFire } from "./issue-directives/target-and-fire";


export class AttackAutoPilot extends AI {

    issueDirectives(context: DescisonContext): Directive[] {
        const { ship, gameState } = context
        const { enemies } = identifyShips(ship, gameState)

        if (!this.state.destination) {
            this.setDestinationToCurrentWaypoint()
        }
        if (this.state.destination && getDistance(ship, this.state.destination) < TERRAIN_SQUARE_SIZE / 2) {
            this.setDestinationToNextWaypoint()
        }

        const { ship: targetShip, distance: range } = this.getCurrentTargetOrChooseClosest(ship, enemies)
        if (targetShip) {
            if (range > DEFAULT_FIRE_DISTANCE) {
                return approach(targetShip, ship)
            }
            return [
                { order: Order.SAILS_TO, quantity: .5 },
                ...turnToAndFire({ target: targetShip, range }, ship)
            ]
        }

        if (!targetShip) {
            return followCurrentPath(this, ship)
        }

        return []
    }
}
