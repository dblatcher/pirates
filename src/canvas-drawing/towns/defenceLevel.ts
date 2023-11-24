import { DEFENCES_TO_REPEL_INVADERS, TOWN_SIZE, Town, ViewPort } from "../../game-state";
import { OffsetDrawMethods } from "../drawWithOffSet";
import { flash } from "../helpers";

export const showDefenceLevel = (
    ctx: CanvasRenderingContext2D,
    _drawingMethods: OffsetDrawMethods,
    viewPort: ViewPort,
    town: Town,
    cycleNumber: number,
) => {

    ctx.beginPath()
    const defenceString = `${town.defences}/${town.profile.maxDefences}`
    ctx.font = '20px arial'
    ctx.fillStyle = town.defences < DEFENCES_TO_REPEL_INVADERS ? flash(cycleNumber, ['red', 'white']) : 'white'
    ctx.fillText(defenceString, town.x - viewPort.x - TOWN_SIZE / 2, town.y - viewPort.y)

    ctx.beginPath()
    const garrisonString = `${town.garrison} troops`
    ctx.font = '18px arial'
    ctx.fillStyle = 'white'
    ctx.fillText(garrisonString, town.x - viewPort.x - TOWN_SIZE / 3, town.y - viewPort.y + 25)

}