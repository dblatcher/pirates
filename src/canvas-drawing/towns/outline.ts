import { FORT_SIZE, Fort, TOWN_SIZE, Town } from "../../game-state";
import { translate } from "../../lib/geometry";
import { OffsetDrawMethods } from "../drawWithOffSet";

export const drawTownOutline = (
    ctx: CanvasRenderingContext2D,
    drawingMethods: OffsetDrawMethods,
    town: Town,
    cycleNumber: number,
    beingInvaded: boolean,
) => {

    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = (beingInvaded && cycleNumber % 30 > 15) ? 'red' : 'black'
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
}