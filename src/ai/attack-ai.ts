import { AI, AIState, DescisonContext } from ".";
import { Directive } from "../game-state";
import { performPatrolMission } from "./high-level-logic/patrol-misson";




export class AttackAutoPilot extends AI {

    constructor(initialState: AIState = {
        mission: { type: 'patrol', waypoints: [] },
        path: [],
    }, debugToConsole?: boolean) {
        super(initialState, debugToConsole)
    }

    issueDirectives(context: DescisonContext): Directive[] {
        return performPatrolMission(this, context)
    }
}
