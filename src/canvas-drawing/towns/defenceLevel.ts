import { TOWN_SIZE, Town } from "../../game-state";
import { colors, rgb } from "../../lib/Color";
import { OffsetDrawMethods } from "@dblatcher/sprite-canvas";

export const showDefenceLevel = (
    drawingMethods: OffsetDrawMethods,
    town: Town,
) => {
    const { fillText, ctx } = drawingMethods
    ctx.beginPath()
    const garrisonString = `${town.garrison} troops`
    ctx.font = 'bold 30px arial'
    ctx.fillStyle = rgb(colors.BLACK)

    fillText(garrisonString, town.x + TOWN_SIZE * 0.4, town.y + TOWN_SIZE * 0.6)
}