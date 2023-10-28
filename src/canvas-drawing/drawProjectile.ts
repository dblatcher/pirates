import { Projectile } from "../game-state/types";

export const drawProjectile = (ctx: CanvasRenderingContext2D, projectile: Projectile) => {

    const { x, y, z } = projectile

    //shadpw
    ctx.beginPath();
    ctx.strokeStyle = 'black'
    ctx.fillStyle = 'grey'
    ctx.arc(x, y, 3, 0, Math.PI * 2)
    ctx.stroke();
    ctx.fill();

    // ball
    ctx.beginPath();
    ctx.strokeStyle = 'black'
    ctx.fillStyle = 'black'
    ctx.arc(x + z / 2, y - z / 2, 3, 0, Math.PI * 2)
    ctx.stroke();
    ctx.fill();
}