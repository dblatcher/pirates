import { Directive } from "../game-state";
import { AI } from "./base-class";
import { performEscortMission } from "./high-level-logic/escort-mission";
import { DescisonContext } from "./types";


export class EscortAutoPilot extends AI {
    issueDirectives(context: DescisonContext): Directive[] {
        return performEscortMission(this, context)
    }
}

