import { DEFENCES_TO_REPEL_INVADERS, Town, ViewPort } from "../../game-state";
import { OffsetDrawMethods } from "../drawWithOffSet";

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
    ctx.fillStyle = (town.defences < DEFENCES_TO_REPEL_INVADERS && cycleNumber % 30 > 15) ? 'red' : 'white'
    ctx.fillText(defenceString, town.x - viewPort.x, town.y - viewPort.y)

}