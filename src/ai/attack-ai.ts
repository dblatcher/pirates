import { AI } from ".";
import { DEFAULT_FIRE_DISTANCE, Directive, GameState, Order, Ship } from "../game-state";
import { CellMatrix } from "../lib/path-finding/types";
import { identifyShips } from "./identify-ships";
import { approach } from "./issue-directives/approach";
import { followCurrentPath } from "./issue-directives/follow-path";
import { turnToAndFire } from "./issue-directives/target-and-fire";


export class AttackAutoPilot extends AI {

    issueDirectives(ship: Ship, gameState: GameState, _matrix: CellMatrix): Directive[] {
        const { enemies } = identifyShips(ship, gameState)

        const { patrolPointIndex = 0, patrolPath } = this.state.mission
        if (!this.state.destination) {
            if (patrolPath && patrolPath.length > 0) {
                const nextPatrolPointIndex = patrolPointIndex + 1 >= patrolPath.length ? 0 : patrolPointIndex + 1
                this.setDestination(patrolPath[nextPatrolPointIndex])
                this.state.mission.patrolPointIndex = nextPatrolPointIndex
                this.debugLog(`destination is now`, this.state.destination)
            } else {
                this.debugLog(`cannot set destination - no patrol path`)
            }
        }

        const { ship: targetShip, distance: range } = this.getCurrentTargetOrChooseClosest(ship, enemies)
        if (targetShip) {
            this.state.mission.patrolPointIndex = undefined
            this.setDestination(undefined)
            if (range > DEFAULT_FIRE_DISTANCE) {
                return approach(targetShip, ship)
            }
            return [
                { order: Order.SAILS_TO, quantity: .5 },
                ...turnToAndFire({ target: targetShip, range }, ship)
            ]
        }

        // TO DO - if patrolPointIndex is undefined, go to closest point on the patrol route
        if (!targetShip) {
            return followCurrentPath(this, ship)
        }

        return []
    }
}
