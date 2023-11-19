import { TERRAIN_SQUARE_SIZE } from "../../game-state/land"
import { GameState, Ship, Town } from "../../game-state"
import { rgb } from "../../lib/Color"
import { CellMatrix } from "../../lib/path-finding/types"
import { getTownColor, s } from "../helpers"

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

const crossSize = 20
const plotShips = (ctx: CanvasRenderingContext2D, ships: Ship[]) => {
    ships.forEach(ship => {
        ctx.beginPath()
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 5
        ctx.moveTo(ship.x - crossSize, ship.y - crossSize)
        ctx.lineTo(ship.x + crossSize, ship.y + crossSize)
        ctx.moveTo(ship.x + crossSize, ship.y - crossSize)
        ctx.lineTo(ship.x - crossSize, ship.y + crossSize)
        ctx.stroke()
    })
}

const plotTowns = (ctx: CanvasRenderingContext2D, towns: Town[]) => {
    towns.forEach(town => {
        ctx.beginPath()
        ctx.fillStyle = rgb(getTownColor(town))
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 5
        ctx.arc(...s(town), 50, 0, Math.PI*2)
        ctx.fill()
        ctx.stroke()
        
        ctx.beginPath()
        ctx.fillStyle='white'
        ctx.font = "90px arial";
        ctx.fillText(town.name, town.x-50, town.y+100)
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
    ctx.fillStyle = 'blue'
    ctx.fillRect(0, 0, mapWidth, mapHeight)
    plotMatrix(ctx, matrix)
    plotShips(ctx, gameState.ships)
    plotTowns(ctx, gameState.towns)
}