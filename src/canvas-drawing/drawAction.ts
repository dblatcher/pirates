import { DrawSpriteFunction, OffsetDrawMethods } from "@dblatcher/sprite-canvas";
import { AssetKey } from "../assets";
import { BoardingAction, GameState, InvadingAction } from "../game-state";
import { colors, rgba } from "../lib/Color";
import { XY, xy } from "typed-geometry";
import { average, timePhase } from "../lib/util";
import { s } from "./helpers";


function plotAttack(
    target: XY, attackingShip: XY, attackerCount: number, defenderCount: number, cycleNumber: number,
    drawingMethods: OffsetDrawMethods, drawSprite: DrawSpriteFunction<AssetKey>,
) {
    const { ctx, moveTo, lineTo, arc, fillText } = drawingMethods
    const midPoint = xy(average([target.x, attackingShip.x]), average([target.y, attackingShip.y]))
    const message = `${attackerCount} / ${defenderCount}`

    ctx.beginPath()
    ctx.lineWidth = 5
    ctx.strokeStyle = 'red'
    ctx.setLineDash([6, 6])
    ctx.lineDashOffset = Math.floor((12 - (cycleNumber % 12)) / 2)
    moveTo(...s(attackingShip))
    lineTo(...s(target))
    ctx.stroke()
    ctx.setLineDash([])

    ctx.beginPath()
    ctx.fillStyle = rgba(colors.BLACK, .15)
    arc(...s(midPoint), 35, 0, Math.PI * 2, false)
    ctx.fill()

    const phase = timePhase(cycleNumber, 30, 1)
    const iconSize = 50 + phase

    drawSprite({
        key: 'MISC',
        ...midPoint,
        width: iconSize,
        height: iconSize,
        fx: 2, fy: 3,
        center: true,
    })

    ctx.beginPath()
    ctx.font = 'bold 25px arial'
    ctx.fillStyle = rgba(colors.BLACK, 1)
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    fillText(message, ...s(midPoint))
    ctx.fill()
}

export function drawInvadingAction(drawingMethods: OffsetDrawMethods, drawSprite: DrawSpriteFunction<AssetKey>, action: InvadingAction, game: GameState): void {
    const town = game.towns.find(town => town.id === action.townId)
    const ship = game.ships.find(ship => ship.id === action.attackingShipId)
    if (!town || !ship) { return }
    plotAttack(town, ship, action.numberOfAttackers, town.garrison, game.cycleNumber, drawingMethods, drawSprite)
}

export function drawBoardingAction(drawingMethods: OffsetDrawMethods, drawSprite: DrawSpriteFunction<AssetKey>, action: BoardingAction, game: GameState): void {
    const boardedShip = game.ships.find(ship => ship.id === action.boardedShipId)
    const attackingShip = game.ships.find(ship => ship.id === action.attackingShipId)
    if (!boardedShip || !attackingShip) { return }
    plotAttack(boardedShip, attackingShip, action.numberOfAttackers, boardedShip.marines, game.cycleNumber, drawingMethods, drawSprite)
}
