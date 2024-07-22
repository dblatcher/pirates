import { TOWN_SIZE, Town } from "../../game-state";
import { colors, rgb } from "../../lib/Color";
import { OffsetDrawMethods } from "../drawWithOffSet";

export const showDefenceLevel = (
    ctx: CanvasRenderingContext2D,
    drawingMethods: OffsetDrawMethods,
    town: Town,
) => {
    const { fillText, } = drawingMethods
    ctx.beginPath()
    const garrisonString = `${town.garrison} troops`
    ctx.font = 'bold 30px arial'
    ctx.fillStyle = rgb(colors.BLACK)

    fillText(garrisonString, town.x + TOWN_SIZE * 0.4, town.y + TOWN_SIZE * 0.6)
}