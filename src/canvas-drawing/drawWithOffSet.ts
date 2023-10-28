import { ViewPort } from "../game-state/types";

export type OffsetDrawMethods = {
    arc: (x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean | undefined) => void;
    moveTo: (x: number, y: number) => void;
    lineTo: (x: number, y: number) => void;
}

export const drawWithOffset = (ctx: CanvasRenderingContext2D, viewPort: ViewPort): OffsetDrawMethods => {

    const arc = (x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean | undefined) => ctx.arc(
        x - viewPort.x, y - viewPort.y, radius, startAngle, endAngle, counterclockwise
    )
    const moveTo = (x: number, y: number) => ctx.moveTo(x - viewPort.x, y - viewPort.y)
    const lineTo = (x: number, y: number) => ctx.lineTo(x - viewPort.x, y - viewPort.y)

    return { arc, moveTo, lineTo }
}