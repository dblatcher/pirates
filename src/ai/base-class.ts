import { Directive, GameState, Ship } from "../game-state/types";
import { XY } from "../lib/geometry";
import { AIState } from "./types";



export abstract class AI {
    shipId: number;
    state: AIState;

    constructor(initalState: AIState, shipId: number) {
        this.state = { ...initalState }
        this.shipId = shipId
    }

    abstract issueDirectives(ship: Ship, gameState: GameState): Directive[]

    abstract updatePath(ship: Ship, gameState: GameState): void

    abstract decideOwnMission(gameState: GameState): void

    abstract navigateTo(destination: XY, gameState: GameState): XY[]
}