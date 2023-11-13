import { Flag } from "../game-state/types"
import { XY, _DEG, getXYVector, translate, translateZ } from "../lib/geometry"
import { timePhase } from "../lib/util"
import { OffsetDrawMethods } from "./drawWithOffSet"
import { s } from "./helpers"

const WAVE_PHASE = 8

export const drawFlag = (
    ctx: CanvasRenderingContext2D,
    drawMethods: OffsetDrawMethods,
    position: XY,
    h: number,
    cycleNumber: number,
    color: string,
    flag: Flag = { shape: 'triangle', length: 40, height: 15 },
) => {
    const { lineTo, moveTo } = drawMethods

    const phase = timePhase(cycleNumber, WAVE_PHASE, 1 / 4)
    const waveAngle = phase * _DEG * 2

    ctx.beginPath()
    ctx.fillStyle = color
    switch (flag.shape) {
        case 'triangle':
            moveTo(...s(position))
            lineTo(...s(translateZ(position, flag.height)))
            lineTo(...s(translate(position, getXYVector(flag.length, h + waveAngle))))
            break;
        case "rectangle":
            moveTo(...s(position))
            const top = translateZ(position, flag.height)
            const lowerOut = translate(position, getXYVector(flag.length, h + waveAngle))
            const topOut = translateZ(lowerOut, flag.height)
            lineTo(...s(top))
            lineTo(...s(topOut))
            lineTo(...s(lowerOut))
            break;
    }
    ctx.fill()
}