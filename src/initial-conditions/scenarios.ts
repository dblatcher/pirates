import { GameState } from "../game-state";

export type InitialConditions = {
    gameState: GameState,
    mapWidth: number,
    mapHeight: number,
}

export type Scenario = { (): InitialConditions }
