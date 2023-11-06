import { getProwPosition } from "../../game-state/ship";
import { Ship } from "../../game-state/types";
import { XY, getXYVector, translate } from "../../lib/geometry";
import { OffsetDrawMethods } from "../drawWithOffSet";
import { s } from "../helpers";

const BASE_MAST_HEIGHT = 25

interface MastConfig {
    position: number,
    height: number
}

type MastWithPoints = MastConfig & {
    base: XY,
    top: XY,
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
        ctx.lineWidth = 4;
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
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'red'
        if (index == 0) {
            moveTo(...s(getProwPosition(ship)))
        } else {
            moveTo(...s(array[index - 1].top))
        }
        lineTo(top.x, top.y)
        ctx.stroke();
    })
}