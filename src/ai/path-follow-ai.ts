import { AI, DescisonContext } from ".";
import { Directive } from "../game-state";
import { followCurrentPath } from "./issue-directives/follow-path";

export class PathFollowAutoPilot extends AI {

    issueDirectives(context: DescisonContext): Directive[] {
        const directives: Directive[] = []
        directives.push(...followCurrentPath(this, context))
        return directives
    }
}