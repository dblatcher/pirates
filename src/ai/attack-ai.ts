import { AI, DescisonContext } from ".";
import { Directive } from "../game-state";
import { performPatrolMission } from "./high-level-logic/patrol-misson";


export class AttackAutoPilot extends AI {
    issueDirectives(context: DescisonContext): Directive[] {
        return performPatrolMission(this, context)
    }
}
