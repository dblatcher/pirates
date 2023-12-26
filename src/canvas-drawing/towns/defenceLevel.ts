import { DEFENCES_TO_REPEL_INVADERS, TOWN_SIZE, Town } from "../../game-state";
import { OffsetDrawMethods } from "../drawWithOffSet";
import { flash } from "../helpers";

export const showDefenceLevel = (
    ctx: CanvasRenderingContext2D,
    drawingMethods: OffsetDrawMethods,
    town: Town,
    cycleNumber: number,
) => {
    const { fillText } = drawingMethods

    ctx.beginPath()
    const defenceString = `${town.defences}/${town.profile.maxDefences}`
    ctx.font = '20px arial'
    ctx.fillStyle = town.defences < DEFENCES_TO_REPEL_INVADERS ? flash(cycleNumber, ['red', 'white']) : 'white'
    fillText(defenceString, town.x - TOWN_SIZE / 2, town.y)

    ctx.beginPath()
    const garrisonString = `${town.garrison} troops`
    ctx.font = '18px arial'
    ctx.fillStyle = 'white'
    fillText(garrisonString, town.x - TOWN_SIZE / 3, town.y + 25)
}