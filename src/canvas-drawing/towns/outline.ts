import { FORT_SIZE, Fort, TOWN_SIZE, Town } from "../../game-state";
import { getXYVector, translate } from "../../lib/geometry";
import { OffsetDrawMethods } from "../drawWithOffSet";
import { flash, s } from "../helpers";

export const drawTownOutline = (
    ctx: CanvasRenderingContext2D,
    drawingMethods: OffsetDrawMethods,
    town: Town,
    cycleNumber: number,
    beingInvaded: boolean,
) => {

    ctx.beginPath();
    ctx.lineWidth = 8;
    ctx.strokeStyle = beingInvaded ? flash(cycleNumber, ['red', 'black'], 15) : 'black'
    ctx.fillStyle = 'gray'
    drawingMethods.arc(town.x, town.y, TOWN_SIZE / 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
}
export const drawFortOutline = (
    ctx: CanvasRenderingContext2D,
    drawingMethods: OffsetDrawMethods,
    fort: Fort, town: Town,
    _cycleNumber: number,
) => {

    const position = translate(town, fort.distanceFromTown)
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
}