import { MastConfig, getProwPosition } from "../../game-state/ship";
import { Ship, Wind } from "../../game-state/types";
import { XY, _90_DEG_LEFT, _90_DEG_RIGHT, getXYVector, translate, translateZ } from "../../lib/geometry";
import { drawFlag } from "../drawFlag";
import { OffsetDrawMethods } from "../drawWithOffSet";
import { s, shipColor } from "../helpers";

const BASE_MAST_HEIGHT = 25
const SAIL_END_AT_FULL = .2


type MastWithPoints = MastConfig & {
    base: XY;
    top: XY;
}

const drawFlagOn = (
    mast: MastWithPoints,
    ctx: CanvasRenderingContext2D,
    drawMethods: OffsetDrawMethods,
    ship: Ship,
    cycleNumber: number,
    wind: Wind,
) => {
    drawFlag(ctx, drawMethods, mast.top, wind.direction, cycleNumber, shipColor(ship), mast.flag)
}

export const drawShipMasts = (
    masts: MastConfig[],
    ctx: CanvasRenderingContext2D,
    drawMethods: OffsetDrawMethods,
    ship: Ship,
    cycleNumber: number,
    wind: Wind,
) => {

    const { sailLevel, length, h } = ship
    const { lineTo, moveTo } = drawMethods

    const mastsWithPoints: MastWithPoints[] = masts.map(config => {
        const { position, height } = config
        const base = translate(ship, getXYVector(length * position, h));
        const top = translateZ(base, height * BASE_MAST_HEIGHT)
        return {
            ...config, base, top
        }
    })

    // masts
    mastsWithPoints.forEach(mast => {
        const { base, top } = mast
        ctx.beginPath()
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'black'
        moveTo(base.x, base.y)
        lineTo(top.x, top.y)

        ctx.lineWidth = 2;
        lineTo(...s(translate(top, getXYVector(12, h + _90_DEG_LEFT))))
        lineTo(...s(translate(top, getXYVector(12, h + _90_DEG_RIGHT))))

        ctx.stroke();
    })

    // sails
    mastsWithPoints.forEach(mast => {
        const { height, top } = mast

        const sailHeight = height * sailLevel * BASE_MAST_HEIGHT * (1 - SAIL_END_AT_FULL)
        const topLeft = translate(top, getXYVector(12, h + _90_DEG_LEFT))
        const topRight = translate(top, getXYVector(12, h + _90_DEG_RIGHT))
        const bottomLeft = translateZ(topLeft, -sailHeight)
        const bottomRight = translateZ(topRight, -sailHeight)

        ctx.beginPath()
        ctx.fillStyle = 'rgba(255,255,255,0.8)'
        moveTo(...s(topLeft))
        lineTo(...s(topRight))
        lineTo(...s(bottomRight))
        lineTo(...s(bottomLeft))
        ctx.closePath()
        ctx.fill()
    })

    // rigging
    mastsWithPoints.sort((a, b) => b.position - a.position).forEach((mast, index, array) => {
        const { top } = mast
        ctx.beginPath()
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'red'
        if (index == 0) {
            moveTo(...s(translateZ(getProwPosition(ship), 4)))
        } else {
            moveTo(...s(array[index - 1].top))
        }
        lineTo(top.x, top.y)
        ctx.stroke();
    })

    // flag
    mastsWithPoints.forEach(mast => {
        if (mast.flag) {
            drawFlagOn(mast, ctx, drawMethods, ship, cycleNumber, wind)
        }
    })
}