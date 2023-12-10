import { AI, DescisonContext } from ".";
import { Directive } from "../game-state";
import { performEscortMission } from "./high-level-logic/escort-mission";
import { performPatrolMission } from "./high-level-logic/patrol-misson";
import { followCurrentPath } from "./issue-directives/follow-path";


export class MissonAi extends AI {
    issueDirectives(context: DescisonContext): Directive[] {
        const { mission } = this.state
        switch (mission.type) {
            case "patrol":
                return performPatrolMission(this, context)
            case "follow":
                return performEscortMission(this, context)
            case "travel":
                return followCurrentPath(this, context) // to do - write mission function using waypoints
            default: return []
        }
    }
}
