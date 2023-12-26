import { Flag, InvadingAction, TOWN_SIZE, Town, ViewPort, Wind } from "../../game-state";
import { rgb } from "../../lib/Color";
import { translateZ } from "../../lib/geometry";
import { timePhase } from "../../lib/util";
import { drawIcon } from "../draw-icon";
import { drawFlag, drawFlagPole } from "../drawFlag";
import { OffsetDrawMethods } from "../drawWithOffSet";
import { getFactionColor, isTownInView } from "../helpers";
import { showDefenceLevel } from "./defenceLevel";
import { drawFort } from "./forts";
import { drawTownOutline } from "./outline";

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
    invadingActions: InvadingAction[],
) => {
    const townsInView = towns.filter(town => isTownInView(town, viewPort))
    const idsOfTownsInBeingInvaded = invadingActions.map(_ => _.townId)

    townsInView.forEach(town => {
        const beingInvaded = idsOfTownsInBeingInvaded.includes(town.id)
        const color = getFactionColor(town)
        const flagHeight = Math.min(50, town.garrison * 2)

        drawTownOutline(
            ctx, drawingMethods, town, cycleNumber, beingInvaded
        )
        drawFlagPole(ctx, drawingMethods, town, 80)
        drawFlag(ctx, drawingMethods, translateZ(town, flagHeight), wind.direction, cycleNumber, rgb(color), TOWN_FLAG)

        if (beingInvaded) {
            const phase = timePhase(cycleNumber, 30, 1)
            drawIcon(ctx, drawingMethods, town, { icon: 'RED_CUTLASS', width: TOWN_SIZE + phase, height: TOWN_SIZE + phase })
        }
        showDefenceLevel(ctx, drawingMethods, town, cycleNumber)
    })

    // TO DO - check separately if the fort is in view
    townsInView.forEach(town => {
        town.forts.forEach(fort => {
            drawFort(ctx, drawingMethods, fort, cycleNumber)
        })
    })
}
