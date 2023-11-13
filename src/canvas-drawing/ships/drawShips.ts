import { drawShipMasts } from "./masts"
import { drawShipBase } from "./base"
import { Ship, isShipInView } from "../../game-state/ship"
import { OffsetDrawMethods } from "../drawWithOffSet"
import { drawDamage } from "./damage"
import { ViewPort, Wind } from "../../game-state/types"


export const drawShips = (
    ctx: CanvasRenderingContext2D,
    drawingMethods: OffsetDrawMethods,
    ships: Ship[],
    viewPort: ViewPort,
    cycleNumber: number,
    wind: Wind,
    showCollision = false
) => {

    const shipsInView = ships.filter(ship => isShipInView(ship, viewPort))
    shipsInView.forEach(ship => drawShipBase(ctx, drawingMethods, ship, showCollision))

    shipsInView.forEach(ship => drawDamage(ctx, drawingMethods, ship, cycleNumber))
    shipsInView.forEach(ship => {
        drawShipMasts(ship.profile.masts, ctx, drawingMethods, ship, cycleNumber, wind)
    })
}