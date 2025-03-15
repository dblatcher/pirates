import { OffsetDrawMethods } from "@dblatcher/sprite-canvas";
import { Objective } from "../game-state";

export const drawObjective = (ctx: CanvasRenderingContext2D, drawingMethods: OffsetDrawMethods, objective: Objective) => {
    const { x, y, obtained } = objective
    if (!obtained) {
        const { arc } = drawingMethods
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.fillStyle = 'gold'
        ctx.strokeStyle = 'red'
        arc(x, y, 10, 0, Math.PI * 2)
        ctx.fill();
        ctx.stroke();
    }
}
