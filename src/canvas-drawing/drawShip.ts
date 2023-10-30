import { getCollisionCircles } from "../game-state/ship";
import { Ship } from "../game-state/types";
import { getXYVector, translate } from "../lib/geometry";
import { OffsetDrawMethods } from "./drawWithOffSet";


export const drawShipBase = (ctx: CanvasRenderingContext2D, drawMethods: OffsetDrawMethods, ship: Ship) => {
    const { x, y, h, width, length } = ship
    const { arc, lineTo, moveTo } = drawMethods
    const fore = translate(getXYVector((length) / 2, h), { x, y })
    const back = translate(getXYVector(-length / 2, h), { x, y })
    const foreCircle = translate(getXYVector((length - width) / 2, h), { x, y })
    const backCircle = translate(getXYVector(-(length - width) / 2, h), { x, y })

    const collisionCircles = getCollisionCircles(ship)

    collisionCircles.forEach(circle => {
        ctx.beginPath();
        ctx.fillStyle = 'grey'
        arc(circle.x, circle.y, circle.r, 0, Math.PI * 2)
        ctx.fill();
    })

    ctx.beginPath();
    ctx.strokeStyle = 'brown'
    arc(backCircle.x, backCircle.y, width / 2, 0, Math.PI * 2)
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = 'brown'
    arc(x, y, width / 2, 0, Math.PI * 2)
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = 'red'
    arc(foreCircle.x, foreCircle.y, width / 2, 0, Math.PI * 2)
    ctx.stroke();

    ctx.beginPath()
    ctx.strokeStyle = 'black'
    moveTo(back.x, back.y)
    lineTo(fore.x, fore.y)
    ctx.stroke();
}

export const drawShipMast = (ctx: CanvasRenderingContext2D, drawMethods: OffsetDrawMethods, ship: Ship) => {
    const { x, y, sailLevel } = ship
    const { lineTo, moveTo } = drawMethods
    const mastTop = translate({ x, y }, { x: 25, y: -25 })

    ctx.beginPath()
    ctx.strokeStyle = 'black'
    moveTo(x, y)
    lineTo(mastTop.x, mastTop.y)
    ctx.stroke();

    if (sailLevel) {
        ctx.beginPath()
        ctx.fillStyle = 'white'
        moveTo(mastTop.x - 15, mastTop.y - 5)
        lineTo(mastTop.x + 10, mastTop.y + 5)
        lineTo(mastTop.x + 10, mastTop.y + (20 * sailLevel))
        lineTo(mastTop.x - 15, mastTop.y + (30 * sailLevel))
        ctx.closePath()
        ctx.fill()
    }
}