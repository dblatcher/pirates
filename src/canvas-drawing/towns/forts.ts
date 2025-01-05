import { DAMAGE_THAT_STOPS_FORTS_FIRING, FORT_SIZE, Fort, MAXIMUM_DAMAGE_A_FORT_TAKES } from "../../game-state";
import { XY, getXYVector, translate } from "../../lib/geometry";
import { drawFlame } from "../drawFlame";
import { OffsetDrawMethods } from "@dblatcher/sprite-canvas";
import { s } from "../helpers";

export const drawFort = (
    ctx: CanvasRenderingContext2D,
    drawingMethods: OffsetDrawMethods,
    fort: Fort,
    cycleNumber: number,
) => {

    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black'
    ctx.fillStyle = 'gray'
    drawingMethods.arc(...s(fort), FORT_SIZE / 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();

    ctx.beginPath()
    drawingMethods.moveTo(...s(fort))
    drawingMethods.lineTo(...s(translate(fort, getXYVector(FORT_SIZE * (3 / 8), fort.h || 0))))
    ctx.stroke()

    drawFortDamage(ctx, drawingMethods, fort, fort.damage, cycleNumber)
}

const drawFortDamage = (
    ctx: CanvasRenderingContext2D,
    drawingMethods: OffsetDrawMethods,
    fortPosition: XY,
    damage: number,
    cycleNumber: number,
) => {
    if (damage > 0) {
        if (damage === MAXIMUM_DAMAGE_A_FORT_TAKES) {
            drawFlame(ctx, drawingMethods, translate(fortPosition, { x: FORT_SIZE / 3, y: FORT_SIZE / 3 }), cycleNumber)
            drawFlame(ctx, drawingMethods, translate(fortPosition, { x: -FORT_SIZE / 3, y: FORT_SIZE / 3 }), cycleNumber)
        }
        drawFlame(ctx, drawingMethods, fortPosition, cycleNumber, damage >= DAMAGE_THAT_STOPS_FORTS_FIRING ? 2 : 1)
    }
}