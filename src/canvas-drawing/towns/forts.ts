import { DAMAGE_THAT_STOPS_FORTS_FIRING, FORT_SIZE, Fort, MAXIMUM_DAMAGE_A_FORT_TAKES, Town } from "../../game-state";
import { getFortPosition } from "../../game-state/towns/town-functions";
import { XY, getXYVector, translate } from "../../lib/geometry";
import { drawFlame } from "../drawFlame";
import { OffsetDrawMethods } from "../drawWithOffSet";
import { s } from "../helpers";

export const drawFort = (
    ctx: CanvasRenderingContext2D,
    drawingMethods: OffsetDrawMethods,
    fort: Fort, town: Town,
    cycleNumber: number,
) => {

    const position = getFortPosition(fort, town)
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black'
    ctx.fillStyle = 'gray'
    drawingMethods.arc(position.x, position.y, FORT_SIZE / 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();

    ctx.beginPath()
    drawingMethods.moveTo(...s(position))
    drawingMethods.lineTo(...s(translate(position, getXYVector(FORT_SIZE * (3 / 8), fort.aimDirection || 0))))
    ctx.stroke()

    drawFortDamage(ctx, drawingMethods, position, fort.damage, cycleNumber)
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