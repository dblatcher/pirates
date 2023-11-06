import { drawShipMasts } from "./masts"
import { drawShipBase } from "./base"
import { Ship } from "../../game-state/ship"
import { OffsetDrawMethods } from "../drawWithOffSet"


export const drawShips = (ctx: CanvasRenderingContext2D,
    drawingMethods: OffsetDrawMethods,
    ships: Ship[],
    showCollision = false) => {

    ships.forEach(ship => drawShipBase(ctx, drawingMethods, ship, showCollision))

    ships.forEach(ship => {
        drawShipMasts([
            { position: -1 / 5, height: 1.5 },
            { position: 1 / 4, height: 1 },
        ], ctx, drawingMethods, ship)
    })
}