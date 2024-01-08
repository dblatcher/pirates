import { MissonAi } from "./mission-ai";
import { AIState } from "./types";


export class FollowerAutoPilot extends MissonAi {
    constructor(idOfShipToFollow: number, shipId: number, debugToConsole = false) {
        const initalState: AIState = {
            mission: {
                type: 'follow',
                targetShipId: idOfShipToFollow
            },
            path: [],
        }
        super(initalState, shipId, debugToConsole)
    }
}
