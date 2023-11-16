import { ViewPort } from "../game-state/types";

export type OffsetDrawMethods = {
    arc: (x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean | undefined) => void;
    moveTo: (x: number, y: number) => void;
    lineTo: (x: number, y: number) => void;
    arcTo: (x1: number, y1: number, x2: number, y2: number, radius: number) => void;
    rect: (x: number, y: number, w: number, h: number) => void;
    quadraticCurveTo: (cpx: number, cpy: number, x: number, y: number) => void
    drawImage: (
        image: CanvasImageSource,
        x1: number, y1: number, w1?: number, h1?: number,
        x2?: number, y2?: number, w2?: number, h2?: number,
    ) => void
}

export const drawWithOffset = (ctx: CanvasRenderingContext2D, viewPort: ViewPort): OffsetDrawMethods => {

    const arc = (x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean | undefined) => ctx.arc(
        x - viewPort.x, y - viewPort.y, radius, startAngle, endAngle, counterclockwise
    )
    const moveTo = (x: number, y: number) => ctx.moveTo(x - viewPort.x, y - viewPort.y)
    const lineTo = (x: number, y: number) => ctx.lineTo(x - viewPort.x, y - viewPort.y)
    const arcTo = (x1: number, y1: number, x2: number, y2: number, radius: number) =>
        ctx.arcTo(x1 - viewPort.x, y1 - viewPort.y, x2 - viewPort.x, y2 - viewPort.y, radius)

    const rect = (x: number, y: number, w: number, h: number) =>
        ctx.rect(x - viewPort.x, y - viewPort.y, w, h)

    const quadraticCurveTo = (cpx: number, cpy: number, x: number, y: number) =>
        ctx.quadraticCurveTo(cpx - viewPort.x, cpy - viewPort.y, x - viewPort.x, y - viewPort.y)

    const drawImage = (
        image: CanvasImageSource,
        x1: number, y1: number, w1?: number, h1?: number,
        x2?: number, y2?: number, w2?: number, h2?: number,
    ) =>
        (
            typeof w1 === 'number' && typeof h1 === 'number' &&
            typeof x2 === 'number' && typeof y2 === 'number' &&
            typeof w2 === 'number' && typeof h2 === 'number'
        )
            ? ctx.drawImage(image, x1, y1, w1, h1, x2 - viewPort.x, y2 - viewPort.y, w2, h2)
            : (typeof w1 === 'number' && typeof h1 === 'number')
                ? ctx.drawImage(image, x1 - viewPort.x, y1 - viewPort.y, w1, h1)
                : ctx.drawImage(image, x1 - viewPort.x, y1 - viewPort.y)

    return { arc, moveTo, lineTo, arcTo, rect, quadraticCurveTo, drawImage }
}