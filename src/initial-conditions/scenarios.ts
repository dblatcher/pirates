import { GameState } from "../game-state";

export type Scenario = {
    makeInitialState: { (): GameState }
    mapWidth: number,
    mapHeight: number,
    name?: string,
}
