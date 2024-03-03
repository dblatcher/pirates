import { MissonAi } from "./mission-ai";
import { AIState } from "./types";


export class FollowerAutoPilot extends MissonAi {
    constructor(idOfShipToFollow: number, debugToConsole = false) {
        const initalState: AIState = {
            mission: {
                type: 'follow',
                targetShipId: idOfShipToFollow
            },
            path: [],
        }
        super(initalState, -1, debugToConsole)
    }
}
