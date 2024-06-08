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
    gameStateRef: React.MutableRefObject<GameState>,
    viewPortRef: React.MutableRefObject<ViewPort>,
    obstacleMatrix: CellMatrix,
    paddedObstacleMatrix: CellMatrix,
    getAndClearDirectives: { (): Directive[] },
    updateTimeTracking: { (refreshStart: number): void },
    pushLog: { (message: string, timestamp: number): void },
    soundDeck: SoundDeck,
) => () => {
    const refreshStart = Date.now()
    const soundEffectRequests: SoundEffectRequest[] = []

    const player = gameStateRef.current.ships.find(ship => ship.id === gameStateRef.current.playerId)
    if (player) {
        const viewPortWidth = SCREEN_WIDTH / magnify
        const viewPortHeight = SCREEN_HEIGHT / magnify
        Object.assign(viewPortRef.current, {
            width: viewPortWidth,
            height: viewPortHeight,
            x: clamp(player.x - viewPortWidth * .5, gameStateRef.current.mapWidth - (viewPortWidth * 1), 0),
            y: clamp(player.y - viewPortRef.current.height * .5, gameStateRef.current.mapHeight - (viewPortHeight), 0),
        })
    }
    const updatedGame = cycle(
        gameStateRef.current,
        getAndClearDirectives(),
        obstacleMatrix,
        paddedObstacleMatrix,
        pushLog,
        soundEffectRequests,
        viewPortRef.current,
        aiFactory,
    )
    Object.assign(gameStateRef.current, updatedGame)

    playSoundEffectsInView(soundEffectRequests, soundDeck, viewPortRef.current)
    updateTimeTracking(refreshStart)
}
