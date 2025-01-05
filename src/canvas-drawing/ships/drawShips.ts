import { OffsetDrawMethods, drawSpriteFunc } from "@dblatcher/sprite-canvas"
import { AssetMap } from "../../context/asset-context"
import { GameState, ViewPort } from "../../game-state"
import { isShipInView } from "../../game-state/ship"
import { timePhase } from "../../lib/util"
import { drawShipBase } from "./base"
import { drawDamage } from "./damage"
import { drawShipMasts } from "./masts"
import { assetParams } from "../../assets"


export const drawShips = (
    ctx: CanvasRenderingContext2D,
    drawingMethods: OffsetDrawMethods,
    assets: AssetMap,
    viewPort: ViewPort,
    gameState: GameState,
    showCollision = false
) => {

    const { ships, wind, cycleNumber } = gameState
    const drawSprite = drawSpriteFunc(drawingMethods, assets, assetParams)
    const shipsInView = ships.filter(ship => isShipInView(ship, viewPort))
    shipsInView.forEach(ship => drawShipBase(ctx, drawingMethods, ship, showCollision))
    shipsInView.forEach(ship => drawDamage(ctx, drawingMethods, ship, cycleNumber))
    shipsInView.forEach(ship => {
        drawShipMasts(ship.profile.masts, ctx, drawingMethods, ship, cycleNumber, wind)
    })
    shipsInView.forEach(ship => {
        if (ship.underRepair) {
            const phase = timePhase(cycleNumber, 30, 1)
            drawSprite({ key: 'MISC', width: 50 + phase, height: 50 + phase, x: ship.x, y: ship.y, center: true, fx: 2, fy: 2 })
        }
    })
}