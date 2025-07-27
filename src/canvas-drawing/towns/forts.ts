import { DAMAGE_THAT_STOPS_FORTS_FIRING, FORT_SIZE, Fort, MAXIMUM_DAMAGE_A_FORT_TAKES } from "../../game-state";
import { XY, getXYVector, translate } from "typed-geometry";
import { drawFlame } from "../drawFlame";
import { OffsetDrawMethods } from "@dblatcher/sprite-canvas";
import { s } from "../helpers";

export const drawFort = (
    drawingMethods: OffsetDrawMethods,
    fort: Fort,
    cycleNumber: number,
) => {
    const { ctx, arc, moveTo, lineTo } = drawingMethods
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black'
    ctx.fillStyle = 'gray'
    arc(...s(fort), FORT_SIZE / 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();

    ctx.beginPath()
    moveTo(...s(fort))
    lineTo(...s(translate(fort, getXYVector(FORT_SIZE * (3 / 8), fort.h || 0))))
    ctx.stroke()

    drawFortDamage(drawingMethods, fort, fort.damage, cycleNumber)
}

const drawFortDamage = (
    drawingMethods: OffsetDrawMethods,
    fortPosition: XY,
    damage: number,
    cycleNumber: number,
) => {
    if (damage > 0) {
        if (damage === MAXIMUM_DAMAGE_A_FORT_TAKES) {
            drawFlame(drawingMethods, translate(fortPosition, { x: FORT_SIZE / 3, y: FORT_SIZE / 3 }), cycleNumber)
            drawFlame(drawingMethods, translate(fortPosition, { x: -FORT_SIZE / 3, y: FORT_SIZE / 3 }), cycleNumber)
        }
        drawFlame(drawingMethods, fortPosition, cycleNumber, damage >= DAMAGE_THAT_STOPS_FORTS_FIRING ? 2 : 1)
    }
}