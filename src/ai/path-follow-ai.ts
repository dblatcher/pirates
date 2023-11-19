import { AI } from ".";
import { Directive, GameState, Ship } from "../game-state";
import { followCurrentPath } from "./issue-directives/follow-path";

export class PathFollowAutoPilot extends AI {

    issueDirectives(ship: Ship, gameState: GameState): Directive[] {
        const directives: Directive[] = []
        directives.push(...followCurrentPath(this, ship))
        return directives
    }

    decideOwnMission(gameState: GameState): void {
        throw new Error("Method not implemented.");
    }

}