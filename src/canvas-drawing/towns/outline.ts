import { TOWN_SIZE, Town } from "../../game-state";
import { OffsetDrawMethods } from "../drawWithOffSet";
import { flash } from "../helpers";

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
