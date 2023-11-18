import { Town, ViewPort } from "../../game-state/types";
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
    ctx.fillStyle = (town.defences < 20 && cycleNumber % 30 > 15) ? 'red' : 'white'
    ctx.fillText(defenceString, town.x - viewPort.x, town.y - viewPort.y)

}