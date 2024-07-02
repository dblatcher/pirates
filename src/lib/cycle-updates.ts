import { SoundDeck } from "sound-deck"
import { aiFactory } from "../factory"
import { GameState, ViewPort, Directive, cycle } from "../game-state"
import { SoundEffectRequest } from "../game-state/model/sound"
import { CellMatrix } from "./path-finding/types"
import { playSoundEffectsInView } from "./sounds"
import { clamp } from "./util"

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
    const {width, height} = viewPort
    if (player) {
        Object.assign(viewPort, {
            x: clamp(player.x - width * .5, gameState.mapWidth - (width * 1), 0),
            y: clamp(player.y - height * .5, gameState.mapHeight - (height), 0),
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
