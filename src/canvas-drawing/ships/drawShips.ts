import { drawShipMasts } from "./masts"
import { drawShipBase } from "./base"
import { Ship, isShipInView } from "../../game-state/ship"
import { OffsetDrawMethods } from "../drawWithOffSet"
import { drawDamage } from "./damage"
import { ViewPort } from "../../game-state/types"


export const drawShips = (
    ctx: CanvasRenderingContext2D,
    drawingMethods: OffsetDrawMethods,
    ships: Ship[],
    viewPort:ViewPort,
    cycleNumber: number,
    showCollision = false
) => {

    const shipsInView = ships.filter(ship => isShipInView(ship, viewPort))
    shipsInView.forEach(ship => drawShipBase(ctx, drawingMethods, ship, showCollision))

    shipsInView.forEach(ship => drawDamage(ctx, drawingMethods, ship, cycleNumber))
    shipsInView.forEach(ship => {
        drawShipMasts([
            { position: -1 / 5, height: 1.5 },
            { position: 1 / 4, height: 1 },
        ], ctx, drawingMethods, ship, cycleNumber)
    })
}