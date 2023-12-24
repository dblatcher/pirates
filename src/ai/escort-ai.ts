import { MissonAi } from "./mission-ai";
import { AIState } from "./types";


export class EscortAutoPilot extends MissonAi {
    constructor(idOfShipToEscort: number, shipId: number, debugToConsole = false) {
        const initalState: AIState = {
            mission: {
                type: 'follow',
                targetShipId: idOfShipToEscort
            },
            path: [],
        }
        super(initalState, shipId, debugToConsole)
    }
}
