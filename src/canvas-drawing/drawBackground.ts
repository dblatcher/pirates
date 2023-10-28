import { ViewPort } from "../game-state/types";
import { OffsetDrawMethods } from "./drawWithOffSet";

export const drawBackground = (
    ctx: CanvasRenderingContext2D,
    drawingMethods: OffsetDrawMethods,
    viewPort: ViewPort
) => {
    const { arc } = drawingMethods
    const leftmostWave = viewPort.x - viewPort.x % 50
    const horizontalWaveCount = 2 + viewPort.width / 50
    const topMostWave = viewPort.y - viewPort.y % 75
    const vericalWaveCount = 2 + viewPort.height / 75

    for (let top = 0; top < vericalWaveCount; top++) {
        for (let left = 0; left < horizontalWaveCount; left++) {
            ctx.beginPath()
            ctx.strokeStyle = 'white'
            arc(leftmostWave + 50 * left, topMostWave + 75 * top, 10, Math.PI * 0, Math.PI * 1, true)
            ctx.stroke()
        }
    }
}