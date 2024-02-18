import { TOWN_SIZE, Town } from "../../game-state";
import { OffsetDrawMethods } from "../drawWithOffSet";

export const showDefenceLevel = (
    ctx: CanvasRenderingContext2D,
    drawingMethods: OffsetDrawMethods,
    town: Town,
) => {
    const { fillText } = drawingMethods
    ctx.beginPath()
    const garrisonString = `${town.garrison} troops`
    ctx.font = '18px arial'
    ctx.fillStyle = 'white'
    fillText(garrisonString, town.x - TOWN_SIZE / 3, town.y + 25)
}