import { GameState } from "../game-state";

export type IntroPage = { text: string }

export type Intro = {
    pages: IntroPage[]
}

export type Scenario = {
    makeInitialState: { (): GameState }
    mapWidth: number,
    mapHeight: number,
    name?: string,
    intro?: Intro,
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