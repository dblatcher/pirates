import { OffsetDrawMethods } from "@dblatcher/sprite-canvas";
import { XY, _90_DEG_LEFT, _90_DEG_RIGHT, getXYVector, translate } from "typed-geometry";
import { MastConfig, Ship, Wind } from "../../game-state";
import { getProwPosition } from "../../game-state/ship";
import { SAIL_COLOR_CSS, rgb } from "../../lib/Color";
import { drawFlag } from "../drawFlag";
import { getFactionColor, getFactionSecondColor, s, translateZ } from "../helpers";

const BASE_MAST_HEIGHT = 25
const SAIL_END_AT_FULL = .2


type MastWithPoints = MastConfig & {
    base: XY;
    top: XY;
}

const drawFlagOn = (
    mast: MastWithPoints,
    drawMethods: OffsetDrawMethods,
    ship: Ship,
    cycleNumber: number,
    wind: Wind,
) => {
    drawFlag(drawMethods, mast.top, wind.direction, cycleNumber, rgb(getFactionColor(ship)), rgb(getFactionSecondColor(ship)), mast.flag)
}

export const drawShipMasts = (
    masts: MastConfig[],
    drawMethods: OffsetDrawMethods,
    ship: Ship,
    cycleNumber: number,
    wind: Wind,
) => {

    const { sailLevel, length, h } = ship
    const { lineTo, moveTo, ctx } = drawMethods

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
        ctx.fillStyle = SAIL_COLOR_CSS
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
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rosybrown'
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
            drawFlagOn(mast, drawMethods, ship, cycleNumber, wind)
        }
    })
}