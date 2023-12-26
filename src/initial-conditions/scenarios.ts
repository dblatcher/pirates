import { GameState } from "../game-state";

export type Scenario = {
    makeInitialState: { (): GameState }
    mapWidth: number,
    mapHeight: number,
    name?: string,
}

export const GAME_STATE_DEFAULTS: GameState = {
    cycleNumber: 0,
    ships: [],
    towns: [],
    playerId: 1,
    wind: { force: 1, direction: 0 },
    projectiles: [],
    effects: [],
    surfaceEffects: [],
    land: [],
    boardingActions: [],
    invadingActions: [],
}