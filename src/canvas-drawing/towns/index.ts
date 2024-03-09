import { Flag, InvadingAction, Town, ViewPort, Wind } from "../../game-state";
import { rgb } from "../../lib/Color";
import { translate, translateZ, xy } from "../../lib/geometry";
import { drawFlag, drawFlagPole } from "../drawFlag";
import { drawFlame } from "../drawFlame";
import { OffsetDrawMethods } from "../drawWithOffSet";
import { getFactionColor, getFactionFlag, getFactionSecondColor, isTownInView } from "../helpers";
import { showDefenceLevel } from "./defenceLevel";
import { drawFort } from "./forts";
import { drawTownOutline } from "./outline";


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
        drawTownOutline(
            ctx, drawingMethods, town, cycleNumber
        )
        if (beingInvaded) {
            drawFlame(ctx, drawingMethods, translate(town, xy(-3, -4)), cycleNumber, 3)
        }
        showDefenceLevel(ctx, drawingMethods, town)
    })

    // TO DO - check separately if the fort is in view
    townsInView.forEach(town => {
        town.forts.forEach(fort => {
            drawFort(ctx, drawingMethods, fort, cycleNumber)
        })
    })

    townsInView.forEach(town => {
        const color = getFactionColor(town)
        const secondColor = getFactionSecondColor(town)
        const flagHeight = Math.min(50, town.garrison * 2)
        drawFlagPole(ctx, drawingMethods, town, 80)
        drawFlag(ctx, drawingMethods, 
            translateZ(town, flagHeight), 
            wind.direction, cycleNumber, 
            rgb(color), rgb(secondColor), getFactionFlag(town))
    })
}
