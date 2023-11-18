import { viewPortToRect } from "../../game-state/helpers";
import { Flag, TOWN_SIZE, Town, ViewPort, Wind } from "../../game-state/types";
import { rgb } from "../../lib/Color";
import { expandRect, isPointInsideRect, translateZ } from "../../lib/geometry";
import { drawFlag, drawFlagPole } from "../drawFlag";
import { OffsetDrawMethods } from "../drawWithOffSet";
import { getTownColor } from "../helpers";

const TOWN_FLAG: Flag = {
    shape: 'rectangle', length: 42, height: 30
}

const isTownInView = (town: Town, viewPort: ViewPort): boolean => {
    const rect = expandRect(viewPortToRect(viewPort), TOWN_SIZE)
    return isPointInsideRect(town, rect)
}


export const drawTowns = (
    ctx: CanvasRenderingContext2D,
    drawingMethods: OffsetDrawMethods,
    towns: Town[], viewPort: ViewPort,
    cycleNumber: number,
    wind: Wind,
    _options?: unknown
) => {
    const townsInView = towns.filter(town => isTownInView(town, viewPort))
    const { arc } = drawingMethods

    townsInView.forEach(town => {
        const color = getTownColor(town)
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'black'
        ctx.fillStyle = 'gray'
        arc(town.x, town.y, TOWN_SIZE / 2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
        drawFlagPole(ctx, drawingMethods, town, 80)
        drawFlag(ctx, drawingMethods, translateZ(town, 50), wind.direction, cycleNumber, rgb(color), TOWN_FLAG)
    })
}
