import { Flag, TOWN_SIZE, Town, ViewPort, Wind } from "../../game-state";
import { viewPortToRect } from "../../game-state/helpers";
import { rgb } from "../../lib/Color";
import { expandRect, isPointInsideRect, translateZ } from "../../lib/geometry";
import { drawFlag, drawFlagPole } from "../drawFlag";
import { OffsetDrawMethods } from "../drawWithOffSet";
import { getTownColor } from "../helpers";
import { showDefenceLevel } from "./defenceLevel";

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
    towns: Town[],
    viewPort: ViewPort,
    cycleNumber: number,
    wind: Wind,
) => {
    const townsInView = towns.filter(town => isTownInView(town, viewPort))
    const { arc } = drawingMethods

    townsInView.forEach(town => {
        const beingInvaded = town.invasions.length > 0
        const color = getTownColor(town)
        const flagHeight = Math.min(50, town.garrison * 2)
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = (beingInvaded && cycleNumber % 30 > 15) ? 'red' : 'black'
        ctx.fillStyle = 'gray'
        arc(town.x, town.y, TOWN_SIZE / 2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
        drawFlagPole(ctx, drawingMethods, town, 80)
        drawFlag(ctx, drawingMethods, translateZ(town, flagHeight), wind.direction, cycleNumber, rgb(color), TOWN_FLAG)
        showDefenceLevel(ctx, drawingMethods, viewPort, town, cycleNumber)
    })
}
