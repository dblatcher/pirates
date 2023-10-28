import { ViewPort } from "../game-state/types";
import { OffsetDrawMethods } from "./drawWithOffSet";

const HORIZONTAL_SPACE = 60
const VERTICAL_SPACE = 75

export const drawBackground = (
    ctx: CanvasRenderingContext2D,
    drawingMethods: OffsetDrawMethods,
    viewPort: ViewPort
) => {
    const { arc } = drawingMethods
    const leftmostWave = viewPort.x - viewPort.x % HORIZONTAL_SPACE
    const horizontalWaveCount = 2 + viewPort.width / HORIZONTAL_SPACE
    const topMostWave = viewPort.y - viewPort.y % VERTICAL_SPACE
    const vericalWaveCount = 2 + viewPort.height / VERTICAL_SPACE

    for (let top = 0; top < vericalWaveCount; top++) {
        for (let left = 0; left < horizontalWaveCount; left++) {
            ctx.beginPath()
            ctx.strokeStyle = 'white'
            arc(
                leftmostWave + HORIZONTAL_SPACE * left,
                topMostWave + VERTICAL_SPACE * top,
                8 + Math.random() * 5,
                Math.PI * 0, Math.PI * 1, true)
            ctx.stroke()
        }
    }
}