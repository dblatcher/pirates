import { SoundDeck } from "sound-deck"
import { aiFactory } from "../factory"
import { GameState, ViewPort, Directive, cycle } from "../game-state"
import { SoundEffectRequest } from "../game-state/model/sound"
import { CellMatrix } from "./path-finding/types"
import { playSoundEffectsInView } from "./sounds"
import { clamp } from "./util"

export const magnify = 2 / 3
export const SCREEN_WIDTH = 700
export const SCREEN_HEIGHT = 425

export const makeNextCycleFunction = (
    gameState: GameState,
    viewPort: ViewPort,
    obstacleMatrix: CellMatrix,
    paddedObstacleMatrix: CellMatrix,
    getAndClearDirectives: { (): Directive[] },
    updateTimeTracking: { (refreshStart: number): void },
    pushLog: { (message: string, timestamp: number): void },
    soundDeck: SoundDeck,
) => () => {
    const refreshStart = Date.now()
    const soundEffectRequests: SoundEffectRequest[] = []

    const player = gameState.ships.find(ship => ship.id === gameState.playerId)
    if (player) {
        const viewPortWidth = SCREEN_WIDTH / magnify
        const viewPortHeight = SCREEN_HEIGHT / magnify
        Object.assign(viewPort, {
            // width: viewPortWidth,
            // height: viewPortHeight,
            x: clamp(player.x - viewPortWidth * .5, gameState.mapWidth - (viewPortWidth * 1), 0),
            y: clamp(player.y - viewPort.height * .5, gameState.mapHeight - (viewPortHeight), 0),
        })
    }
    const updatedGame = cycle(
        gameState,
        getAndClearDirectives(),
        obstacleMatrix,
        paddedObstacleMatrix,
        pushLog,
        soundEffectRequests,
        viewPort,
        aiFactory,
    )
    Object.assign(gameState, updatedGame)

    playSoundEffectsInView(soundEffectRequests, soundDeck, viewPort)
    updateTimeTracking(refreshStart)
}
