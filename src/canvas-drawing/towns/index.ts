import { DAMAGE_THAT_STOPS_FORTS_FIRING, FORT_SIZE, Flag, MAXIMUM_DAMAGE_A_FORT_TAKES, Town, ViewPort, Wind } from "../../game-state";
import { getFortPosition } from "../../game-state/towns/town-functions";
import { rgb } from "../../lib/Color";
import { translate, translateZ } from "../../lib/geometry";
import { drawFlag, drawFlagPole } from "../drawFlag";
import { drawFlame } from "../drawFlame";
import { OffsetDrawMethods } from "../drawWithOffSet";
import { getTownColor, isTownInView } from "../helpers";
import { showDefenceLevel } from "./defenceLevel";
import { drawFortOutline, drawTownOutline } from "./outline";

const TOWN_FLAG: Flag = {
    shape: 'rectangle', length: 42, height: 30
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

    townsInView.forEach(town => {
        const beingInvaded = town.invasions.length > 0
        const color = getTownColor(town)
        const flagHeight = Math.min(50, town.garrison * 2)

        drawTownOutline(
            ctx, drawingMethods, town, cycleNumber, beingInvaded
        )
        drawFlagPole(ctx, drawingMethods, town, 80)
        drawFlag(ctx, drawingMethods, translateZ(town, flagHeight), wind.direction, cycleNumber, rgb(color), TOWN_FLAG)
        showDefenceLevel(ctx, drawingMethods, viewPort, town, cycleNumber)

        town.forts.forEach(fort => {
            drawFortOutline(ctx, drawingMethods, fort, town, cycleNumber)
            if (fort.damage > 0) {
                const fortPosition = getFortPosition(fort, town)
                if (fort.damage === MAXIMUM_DAMAGE_A_FORT_TAKES) {
                    drawFlame(ctx, drawingMethods, translate(fortPosition, { x: FORT_SIZE / 3, y: FORT_SIZE / 3 }), cycleNumber)
                    drawFlame(ctx, drawingMethods, translate(fortPosition, { x: -FORT_SIZE / 3, y: FORT_SIZE / 3 }), cycleNumber)
                }
                drawFlame(ctx, drawingMethods, fortPosition, cycleNumber, fort.damage >= DAMAGE_THAT_STOPS_FORTS_FIRING ? 2 : 1)
            }
        })
    })
}
