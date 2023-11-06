import { ViewPort } from "../game-state/types";
import { OffsetDrawMethods } from "./drawWithOffSet";

const HORIZONTAL_SPACE = 60
const VERTICAL_SPACE = 75

const getRadius = (waveX: number, waveY: number, cycleNumber: number): number => {
    const postionFactor = Math.abs((waveX + waveY) % 7);
    const timeFactor = Math.floor(((cycleNumber * 2) % 120) / 30)
    return 3 + postionFactor + timeFactor;
}

export const drawBackground = (
    ctx: CanvasRenderingContext2D,
    drawingMethods: OffsetDrawMethods,
    viewPort: ViewPort,
    cycleNumber: number,
) => {
    const { arc, moveTo } = drawingMethods
    const leftmostWave = viewPort.x - viewPort.x % HORIZONTAL_SPACE
    const horizontalWaveCount = 2 + viewPort.width / HORIZONTAL_SPACE
    const topMostWave = viewPort.y - viewPort.y % VERTICAL_SPACE
    const vericalWaveCount = 2 + viewPort.height / VERTICAL_SPACE

    ctx.beginPath()
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'white'
    for (let top = 0; top < vericalWaveCount; top++) {
        for (let left = 0; left < horizontalWaveCount; left++) {
            const waveX = leftmostWave + HORIZONTAL_SPACE * left;
            const waveY = topMostWave + VERTICAL_SPACE * top;
            moveTo(waveX, waveY)
            arc(
                waveX, waveY,
                getRadius(waveX, waveY, cycleNumber),
                Math.PI * 0, Math.PI * 1, true)
        }
    }
    ctx.stroke()
}