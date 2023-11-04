import { getCollisionCircles, getProwPosition } from "../game-state/ship";
import { Ship } from "../game-state/types";
import { XY, _90_DEG_LEFT, _90_DEG_RIGHT, getXYVector, translate } from "../lib/geometry";
import { OffsetDrawMethods } from "./drawWithOffSet";

const s = (xy: XY): [number, number] => [xy.x, xy.y]

const BASE_MAST_HEIGHT = 25

interface MastConfig {
    position: number,
    height: number
}

type MastWithPoints = MastConfig & {
    base: XY,
    top: XY,
}

export const drawShipBase = (
    ctx: CanvasRenderingContext2D,
    drawMethods: OffsetDrawMethods,
    ship: Ship,
    showCollision = false
) => {
    const { h, width, length } = ship
    const { arc, lineTo, moveTo } = drawMethods

    const r = h + _90_DEG_RIGHT
    const l = h + _90_DEG_LEFT

    const fore = translate(getXYVector((length) / 2, h), ship)
    const foreBack = translate(fore, getXYVector(-width / 2, h))
    const foreLeft = translate(foreBack, getXYVector(width / 2, l))
    const foreRight = translate(foreBack, getXYVector(width / 2, r))

    const back = translate(ship, getXYVector(-(length / 2 - width / 2), h))
    const backLeft = translate(back, getXYVector(width / 2, l))
    const backRight = translate(back, getXYVector(width / 2, r))

    ctx.beginPath()
    ctx.fillStyle = 'brown'
    ctx.strokeStyle = 'goldenrod'

    moveTo(...s(fore))
    lineTo(...s(foreLeft))
    lineTo(...s(backLeft))
    // moveTo(...s(back))

    lineTo(...s(backRight))
    lineTo(...s(foreRight))
    lineTo(...s(fore))
    ctx.stroke()
    if (!showCollision) {
        ctx.fill()
    }

    ctx.beginPath()
    arc(...s(back), width / 2, 0, Math.PI * 2)
    ctx.fill()

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

export const drawShipMasts = (masts: MastConfig[], ctx: CanvasRenderingContext2D, drawMethods: OffsetDrawMethods, ship: Ship) => {

    const { sailLevel, length, h } = ship
    const { lineTo, moveTo } = drawMethods

    const mastsWithPoints: MastWithPoints[] = masts.map(config => {
        const { position, height } = config
        const base = translate(ship, getXYVector(length * position, h));
        const top = translate(base, { x: height * BASE_MAST_HEIGHT, y: -height * BASE_MAST_HEIGHT })
        return {
            ...config, base, top
        }
    })

    // masts
    mastsWithPoints.forEach(mast => {
        const { base, top } = mast
        ctx.beginPath()
        ctx.strokeStyle = 'black'
        moveTo(base.x, base.y)
        lineTo(top.x, top.y)
        ctx.stroke();
    })

    // sails
    mastsWithPoints.forEach(mast => {
        const { height, top } = mast
        ctx.beginPath()
        ctx.fillStyle = 'white'
        moveTo(top.x - 15, top.y - (5 * height))
        lineTo(top.x + 10, top.y + (5 * height))
        lineTo(top.x + 10, top.y + (30 * sailLevel * height))
        lineTo(top.x - 15, top.y + (20 * sailLevel * height))
        ctx.closePath()
        ctx.fill()
    })

        // rigging
        mastsWithPoints.sort((a, b) => b.position - a.position).forEach((mast, index, array) => {
            const { top } = mast
            ctx.beginPath()
            ctx.strokeStyle = 'red'
            if (index == 0) {
                moveTo(...s(getProwPosition(ship)))
            } else {
                moveTo(...s(array[index-1].top))
            }
            lineTo(top.x, top.y)
            ctx.stroke();
        })  
}