import { Accessory, type expressions, type FaceProfile } from "@dblatcher/funny-face";
import { GameState } from "../game-state";

export type Person = {
    profile: FaceProfile,
    accessories?: Accessory[],
    size?: number,
    name?: string,
}

type IntroPage = {
    text: string,
    person?: Person,
    expression?: keyof typeof expressions,
}

export type Intro = {
    pages: IntroPage[]
}

export type ScenarioOutcome = {
    success: boolean
    message: string
    nextScenarioId?: string
    exitToTitle?: boolean
}

export type Scenario = {
    makeInitialState: { (): GameState }
    name?: string,
    intro?: Intro,
    getShareMessage?: { (outcome: ScenarioOutcome): { postText: string } | undefined }
    checkForOutcome?: { (game: GameState): ScenarioOutcome | undefined }
}

export const GAME_STATE_DEFAULTS: Omit<GameState, 'mapWidth' | 'mapHeight'> = {
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
    objectives: [],
}

export const checkForPlayerDeathOutcome = (game: GameState, message = 'You were sunk!'): ScenarioOutcome | undefined => {
    if (!game.ships.some(ship => ship.id === game.playerId)) {
        return {
            success: false,
            message,
        }
    }
}
