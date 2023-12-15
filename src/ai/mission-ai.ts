import { AI, AIState, DescisonContext } from ".";
import { Directive } from "../game-state";
import { performEscortMission } from "./high-level-logic/escort-mission";
import { performHuntMission } from "./high-level-logic/hunt-misson";
import { performPatrolMission } from "./high-level-logic/patrol-misson";
import { performTravelMission } from "./high-level-logic/travel-mission";


export class MissonAi extends AI {
    issueDirectives(context: DescisonContext): Directive[] {
        const { mission } = this.state
        switch (mission.type) {
            case "patrol":
                return performPatrolMission(this, context)
            case "follow":
                return performEscortMission(this, context)
            case "travel":
                return performTravelMission(this, context)
            case 'hunt':
                return performHuntMission(this, context)
            default: return []
        }
    }
}

export class HunterAi extends MissonAi {
    constructor(idOfShipToEscort: number, shipId: number, debugToConsole = false) {
        const initalState: AIState = {
            mission: {
                type: 'hunt',
                targetShipId: idOfShipToEscort
            },
            path: [],
        }
        super(initalState, shipId, debugToConsole)
    }
}