import { AI } from ".";
import { Directive, GameState, Order, Ship, Side } from "../game-state";
import { identifyShips } from "./identify-ships";
import { approach } from "./issue-directives/approach";
import { turnToAndFire } from "./issue-directives/target-and-fire";


export class AttackAutoPilot extends AI {

    issueDirectives(ship: Ship, gameState: GameState): Directive[] {
        const directives: Directive[] = []
        const { enemies } = identifyShips(ship, gameState)

        const { ship: targetShip, distance: range } = this.getCurrentTargetOrChooseClosest(ship, enemies)
        if (targetShip) {
            if (range > 150) {
                directives.push(...approach(targetShip, ship))
            } else {
                directives.push(
                    { order: Order.SAILS_TO, quantity: .5 },
                    ...turnToAndFire({ target: targetShip, range, side: Side.LEFT }, ship)
                )
            }
        }
        return directives
    }

    decideOwnMission(_gameState: GameState): void {
        throw new Error("Method not implemented.");
    }
}
