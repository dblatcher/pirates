import { Directive, GameState } from "../game-state/types";
import { XY } from "../lib/geometry";

type Mission {
    type: string
}

type AIState = {
    mission: Mission;
    destination?: XY;
    path?: XY[];
}

export abstract class AutoCaptain {
    shipId: number;
    state: AIState;

    constructor(initalState: AIState, shipId: number) {
        this.state = { ...initalState }
        this.shipId = shipId
    }

    abstract issueDirectives(gameState: GameState): Directive[]

    abstract decideOwnMission(gameState: GameState): void

    abstract navigateTo(destination: XY, gameState: GameState): XY[]
}