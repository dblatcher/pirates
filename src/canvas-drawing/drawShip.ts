import { getCollisionCircles } from "../game-state/ship";
import { Ship } from "../game-state/types";
import { XY, _90_DEG_LEFT, _90_DEG_RIGHT, getXYVector, translate } from "../lib/geometry";
import { OffsetDrawMethods } from "./drawWithOffSet";

const s = (xy: XY): [number, number] => [xy.x, xy.y]

export const drawShipBase = (
    ctx: CanvasRenderingContext2D,
    drawMethods: OffsetDrawMethods,
    ship: Ship,
    showCollision = false
) => {
    const { h, width, length } = ship
    const { arc, lineTo, moveTo } = drawMethods
    const fore = translate(getXYVector((length) / 2, h), ship)
    const back = translate(getXYVector(-length / 2, h), ship)

    const foreBack = translate(fore, getXYVector(width / 2, h + _90_DEG_LEFT + _90_DEG_LEFT))
    const foreLeft = translate(foreBack, getXYVector(width / 2, h + _90_DEG_LEFT))
    const foreRight = translate(foreBack, getXYVector(width / 2, h + _90_DEG_RIGHT))
    const backLeft = translate(back, getXYVector(width / 2, h + _90_DEG_LEFT))
    const backRight = translate(back, getXYVector(width / 2, h + _90_DEG_RIGHT))

    ctx.beginPath()
    ctx.fillStyle = 'brown'
    ctx.strokeStyle = 'goldenrod'

    moveTo(...s(fore))
    lineTo(...s(foreLeft))
    lineTo(...s(backLeft))
    lineTo(...s(backRight))
    lineTo(...s(foreRight))
    lineTo(...s(fore))
    ctx.stroke()
    if (!showCollision) {
        ctx.fill()
    }
    if (showCollision) {
        const collisionCircles = getCollisionCircles(ship)
        collisionCircles.forEach(circle => {
            ctx.beginPath();
            ctx.fillStyle = 'rgba(255,0,0,.5)'
            arc(circle.x, circle.y, circle.r, 0, Math.PI * 2)
            ctx.fill();
        })
    }
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