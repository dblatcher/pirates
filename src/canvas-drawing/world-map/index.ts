import { GameState, Ship, TERRAIN_SQUARE_SIZE, Town } from "../../game-state"
import { colors, rgb } from "../../lib/Color"
import { getXYVector, translate } from "typed-geometry"
import { CellMatrix } from "../../lib/path-finding/types"
import { getFactionColor, s } from "../helpers"

const plotMatrix = (ctx: CanvasRenderingContext2D, matrix: CellMatrix) => {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            const terrain = matrix[y][x]

            if (terrain) {
                ctx.beginPath()
                ctx.fillStyle = 'green'
                ctx.moveTo(x * TERRAIN_SQUARE_SIZE, y * TERRAIN_SQUARE_SIZE)
                ctx.rect(x * TERRAIN_SQUARE_SIZE, y * TERRAIN_SQUARE_SIZE, TERRAIN_SQUARE_SIZE, TERRAIN_SQUARE_SIZE)
                ctx.fill()
            }
        }
    }
}

const arrowSize = 22
const circleRadius = 25
const plotShips = (ctx: CanvasRenderingContext2D, ships: Ship[], playerId?: number) => {
    ships.forEach(ship => {
        const { x, y, h } = ship
        if (ship.id === playerId) {
            ctx.beginPath()
            ctx.arc(x, y, circleRadius + 5, 0, Math.PI * 2)
            ctx.lineWidth = 5
            ctx.strokeStyle = 'white'
            ctx.stroke()
        }

        ctx.beginPath()
        ctx.arc(x, y, circleRadius, 0, Math.PI * 2)
        ctx.lineWidth = 5
        ctx.strokeStyle = rgb(getFactionColor(ship))
        ctx.fillStyle = 'white'
        ctx.fill()
        ctx.stroke()

        ctx.beginPath()
        ctx.fillStyle = rgb(getFactionColor(ship))

        const front = translate(ship, getXYVector(arrowSize, h))
        const backLeft = translate(ship, getXYVector(arrowSize, h - Math.PI * .75))
        const backRight = translate(ship, getXYVector(arrowSize, h + Math.PI * .75))

        ctx.moveTo(...s(front))
        ctx.lineTo(...s(backLeft))
        ctx.lineTo(...s(backRight))
        ctx.lineTo(...s(front))
        ctx.fill()
    })
}

const plotTowns = (ctx: CanvasRenderingContext2D, towns: Town[]) => {
    towns.forEach(town => {
        ctx.beginPath()
        ctx.fillStyle = rgb(getFactionColor(town))
        ctx.strokeStyle = rgb(colors.BLACK)
        ctx.lineWidth = 5
        ctx.arc(...s(town), 50, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()

        ctx.beginPath()
        ctx.fillStyle = rgb(colors.BLACK)
        ctx.font = "90px arial";
        ctx.fillText(town.name, town.x - 50, town.y + 100)
    })
}


export const buildDrawMapFnc = (
    gameState: GameState, matrix: CellMatrix, mapWidth: number, mapHeight: number
) => (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) {
        return
    }
    ctx.beginPath()
    ctx.clearRect(0, 0, mapWidth, mapHeight)
    plotMatrix(ctx, matrix)
    plotShips(ctx, gameState.ships, gameState.playerId)
    plotTowns(ctx, gameState.towns)
}