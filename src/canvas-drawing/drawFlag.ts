import { Flag } from "../game-state"
import { colors, rgb } from "../lib/Color"
import { XY, _DEG, getXYVector, translate, translateZ } from "../lib/geometry"
import { timePhase } from "../lib/util"
import { OffsetDrawMethods } from "@dblatcher/sprite-canvas"
import { s } from "./helpers"

const WAVE_PHASE = 8

export const drawFlagPole = (
    drawingMethods: OffsetDrawMethods,
    position: XY,
    z: number,
) => {
    const { ctx, moveTo, lineTo } = drawingMethods
    ctx.beginPath()
    ctx.strokeStyle = rgb(colors.BROWN)
    ctx.lineWidth = 4
    moveTo(...s(position))
    lineTo(...s(translateZ(position, z)))
    ctx.stroke()
}

const drawRectangle = (
    waveAngle: number,
    drawMethods: OffsetDrawMethods,
    position: XY,
    h: number,
    color: string,
    height: number, length: number
) => {
    const { lineTo, moveTo, ctx } = drawMethods
    ctx.beginPath()
    ctx.fillStyle = color
    moveTo(...s(position))
    const top = translateZ(position, height)
    const lowerOut = translate(position, getXYVector(length, h + waveAngle))
    const topOut = translateZ(lowerOut, height)
    lineTo(...s(top))
    lineTo(...s(topOut))
    lineTo(...s(lowerOut))
    ctx.fill()
}

export const drawFlag = (
    drawMethods: OffsetDrawMethods,
    position: XY,
    h: number,
    cycleNumber: number,
    mainColor: string,
    secondColor: string,
    flag: Flag = { shape: 'triangle', length: 40, height: 15 },
) => {
    const { lineTo, moveTo, ctx } = drawMethods

    const phase = timePhase(cycleNumber, WAVE_PHASE, 1 / 4)
    const waveAngle = phase * _DEG * 2

    const moveHorizontalAlongFlag = (distance: number, start: XY) => translate(start, getXYVector(distance, h + waveAngle))

    switch (flag.shape) {
        case 'triangle':
            ctx.beginPath()
            ctx.fillStyle = mainColor
            moveTo(...s(position))
            lineTo(...s(translateZ(position, flag.height)))
            lineTo(...s(moveHorizontalAlongFlag(flag.length, position)))
            ctx.fill()
            break;
        case "rectangle": {
            drawRectangle(waveAngle, drawMethods, position, h, mainColor, flag.height, flag.length)
            break;
        }
        case "cross": {
            drawRectangle(waveAngle, drawMethods, position, h, mainColor, flag.height, flag.length)
            drawRectangle(waveAngle, drawMethods, translateZ(position, flag.height * .4), h, secondColor, flag.height * .2, flag.length)
            drawRectangle(waveAngle, drawMethods, moveHorizontalAlongFlag(flag.length * .4, position), h, secondColor, flag.height, flag.length * .2)
            break;
        }
        case "stripe": {
            drawRectangle(waveAngle, drawMethods, position, h, secondColor, flag.height, flag.length)
            drawRectangle(waveAngle, drawMethods, translateZ(position, flag.height * .25), h, mainColor, flag.height * .5, flag.length)
        }
    }
}