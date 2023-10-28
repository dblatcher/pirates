import { Projectile } from "../game-state/types";
import { OffsetDrawMethods } from "./drawWithOffSet";

export const drawProjectile = (ctx: CanvasRenderingContext2D, drawingMethods: OffsetDrawMethods, projectile: Projectile) => {

    const { x, y, z } = projectile
    const { arc } = drawingMethods
    //shadpw
    ctx.beginPath();
    ctx.strokeStyle = 'black'
    ctx.fillStyle = 'grey'
    arc(x, y, 3, 0, Math.PI * 2)
    ctx.stroke();
    ctx.fill();

    // ball
    ctx.beginPath();
    ctx.strokeStyle = 'black'
    ctx.fillStyle = 'black'
    arc(x + z / 2, y - z / 2, 3, 0, Math.PI * 2)
    ctx.stroke();
    ctx.fill();
}