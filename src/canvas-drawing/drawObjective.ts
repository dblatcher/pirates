import { OffsetDrawMethods } from "@dblatcher/sprite-canvas";
import { GameState, Objective } from "../game-state";
import { drawFlag, drawFlagPole } from "./drawFlag";
import { colors, rgb } from "../lib/Color";
import { translateZ } from "./helpers";

export const drawObjective = (
    drawingMethods: OffsetDrawMethods,
    objective: Objective,
    game: GameState,
) => {
    const { ctx } = drawingMethods
    const { wind, cycleNumber } = game
    const { x, y, obtained, flag, flagColorOne = rgb(colors.BLACK), flagColorTwo = rgb(colors.WHITE) } = objective
    if (!obtained) {
        const { arc } = drawingMethods
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.fillStyle = 'gold'
        ctx.strokeStyle = 'red'
        arc(x, y, 10, 0, Math.PI * 2)
        ctx.fill();
        ctx.stroke();

        if (flag) {
            drawFlagPole(drawingMethods, objective, 40)
            drawFlag(
                drawingMethods,
                translateZ(objective, 40 - flag.height),
                wind.direction,
                cycleNumber,
                flagColorOne, flagColorTwo,
                flag
            )
        }
    }
}
