import { Projectile } from "../game-state";
import { OffsetDrawMethods } from "@dblatcher/sprite-canvas";
import { s, translateZ } from "./helpers";

export const drawProjectile = (drawingMethods: OffsetDrawMethods, projectile: Projectile) => {

    const { x, y, z } = projectile
    const { arc, ctx } = drawingMethods
    //shadow
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'grey'
    ctx.fillStyle = 'grey'
    arc(x, y, 2 + z / 16, 0, Math.PI * 2)
    ctx.fill();

    // ball
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black'
    ctx.fillStyle = 'black'
    arc(...s(translateZ({ x, y }, z)), 2, 0, Math.PI * 2)
    ctx.stroke();
    ctx.fill();
}