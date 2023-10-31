import { ViewPort } from "../game-state/types";

export type OffsetDrawMethods = {
    arc: (x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean | undefined) => void;
    moveTo: (x: number, y: number) => void;
    lineTo: (x: number, y: number) => void;
    arcTo: (x1: number, y1: number, x2: number, y2: number, radius: number) => void;
    rect: (x: number, y: number, w: number, h: number) => void;
}

export const drawWithOffset = (ctx: CanvasRenderingContext2D, viewPort: ViewPort): OffsetDrawMethods => {

    const arc = (x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean | undefined) => ctx.arc(
        x - viewPort.x, y - viewPort.y, radius, startAngle, endAngle, counterclockwise
    )
    const moveTo = (x: number, y: number) => ctx.moveTo(x - viewPort.x, y - viewPort.y)
    const lineTo = (x: number, y: number) => ctx.lineTo(x - viewPort.x, y - viewPort.y)
    const arcTo = (x1: number, y1: number, x2: number, y2: number, radius: number) =>
        ctx.arcTo(x1 - viewPort.x, y1 - viewPort.y, x2 - viewPort.x, y2 - viewPort.y, radius)

    const rect = (x: number, y: number, w: number, h: number) => ctx.rect(x - viewPort.x, y - viewPort.y, w, h)

    return { arc, moveTo, lineTo, arcTo, rect }
}