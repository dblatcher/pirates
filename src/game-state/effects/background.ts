import { GameState, ViewPort } from ".."
import { randomInt } from "../../lib/util"
import { EffectType } from "./effect"

const WAVES_AT_ONCE = 80

export function addWaves(gameState: GameState, viewPort: ViewPort) {
    const wavesLeft = gameState.surfaceEffects.filter(_ => _.type === EffectType.WAVE).length
    if (wavesLeft >= WAVES_AT_ONCE) {
        return gameState
    }
    for (let i = wavesLeft; i < WAVES_AT_ONCE; i++) {
        const x = viewPort.x + randomInt(viewPort.width)
        const y = viewPort.y + randomInt(viewPort.width)

        gameState.surfaceEffects.push(
            { type: EffectType.WAVE, timeLeft: 15 + randomInt(15), x, y }
        )
    }
    return gameState
}
