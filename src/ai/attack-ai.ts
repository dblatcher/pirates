import { AI } from ".";
import { Directive, GameState, Ship, Side } from "../game-state/types";
import { findClosestAndDistance } from "../lib/geometry";
import { identifyShips } from "./issue-directives/identify-ships";
import { turnToAndFire } from "./issue-directives/target-and-fire";


export class AttackAutoPilot extends AI {

    issueDirectives(ship: Ship, gameState: GameState): Directive[] {
        const directives: Directive[] = []
        const { enemies } = identifyShips(ship, gameState)
        const { item: closestEnemy, distance: range } = findClosestAndDistance(enemies, ship)
        if (closestEnemy) {
            directives.push(...turnToAndFire({ target: closestEnemy, range, side: Side.LEFT }, ship))
        }
        return directives
    }

    decideOwnMission(gameState: GameState): void {
        throw new Error("Method not implemented.");
    }
}
