import { GameState, ViewPort } from "../../game-state"
import { isBeingBoarded, isBoarding, isShipInView } from "../../game-state/ship"
import { getTownShipIsInvading } from "../../game-state/towns"
import { timePhase } from "../../lib/util"
import { drawIcon } from "../draw-icon"
import { OffsetDrawMethods } from "../drawWithOffSet"
import { drawShipBase } from "./base"
import { drawDamage } from "./damage"
import { drawShipMasts } from "./masts"


export const drawShips = (
    ctx: CanvasRenderingContext2D,
    drawingMethods: OffsetDrawMethods,
    viewPort: ViewPort,
    gameState: GameState,
    showCollision = false
) => {

    const { ships, wind, cycleNumber, towns } = gameState
    const shipsInView = ships.filter(ship => isShipInView(ship, viewPort))
    shipsInView.forEach(ship => drawShipBase(ctx, drawingMethods, ship, showCollision))
    shipsInView.forEach(ship => drawDamage(ctx, drawingMethods, ship, cycleNumber))
    shipsInView.forEach(ship => {
        drawShipMasts(ship.profile.masts, ctx, drawingMethods, ship, cycleNumber, wind)
    })
    shipsInView.forEach(ship => {
        const invading = getTownShipIsInvading(ship, towns)
        const boarding = isBoarding(ship, gameState) // TO DO - make effcient
        const beingBoarded = isBeingBoarded(ship, gameState)
        if (invading || boarding) {
            const phase = timePhase(cycleNumber, 30, 1)
            drawIcon(ctx, drawingMethods, ship, { icon: 'BLACK_CUTLASS', width: 100 + phase, height: 100 + phase })
        }
        if (beingBoarded) {
            const phase = timePhase(cycleNumber, 30, 1)
            drawIcon(ctx, drawingMethods, ship, { icon: 'RED_CUTLASS', width: 100 + phase, height: 100 + phase })
        }
        if (ship.underRepair) {
            const phase = timePhase(cycleNumber, 30, 1)
            drawIcon(ctx, drawingMethods, ship, { icon: 'REPAIR', width: 100 + phase, height: 100 + phase })
        }
    })
}