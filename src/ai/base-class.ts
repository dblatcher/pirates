import { Directive, GameState } from "../game-state/types";
import { XY } from "../lib/geometry";
import { AIState } from "./types";



export abstract class AI {
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