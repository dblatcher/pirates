import { AI, DescisonContext } from ".";
import { Directive } from "../game-state";
import { followCurrentPath } from "./issue-directives/follow-path";

export class PathFollowAutoPilot extends AI {
    issueDirectives(context: DescisonContext): Directive[] {
        return followCurrentPath(this, context)
    }
}