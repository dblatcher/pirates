import { TERRAIN_SQUARE_SIZE } from "../game-state/land";
import { Directive, GameState, Ship } from "../game-state/types";
import { XY } from "../lib/geometry";
import { findPath } from "../lib/path-finding/find-path";
import { CellMatrix } from "../lib/path-finding/types";
import { AIState } from "./types";



export abstract class AI {
    shipId: number;
    state: AIState;

    constructor(initalState: AIState, shipId: number) {
        this.state = { ...initalState }
        this.shipId = shipId
    }

    abstract issueDirectives(ship: Ship, gameState: GameState): Directive[]

    abstract updatePath(ship: Ship, gameState: GameState, matrix: CellMatrix): void

    abstract decideOwnMission(gameState: GameState): void

    navigateTo(start:XY, destination: XY, matrix: CellMatrix): XY[] {
        return findPath(start, destination, matrix, TERRAIN_SQUARE_SIZE)
    }
}