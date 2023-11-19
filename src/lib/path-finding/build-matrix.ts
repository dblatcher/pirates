import { Landmass, TERRAIN_SQUARE_SIZE } from "../../game-state/land";
import { GameState } from "../../game-state";
import { XY } from "../geometry";
import { CellMatrix } from "./types";


const makeEmptyRow = (widthInCells: number): (0 | 1)[] => {
    const row: (0 | 1)[] = []
    row.length = widthInCells
    row.fill(0, 0, widthInCells)
    return row
}

const toCell = (point: XY): XY => {
    return {
        x: Math.floor(point.x / TERRAIN_SQUARE_SIZE),
        y: Math.floor(point.y / TERRAIN_SQUARE_SIZE)
    }
}

const landToCells = (landmass: Landmass): XY[] => {
    // WRONG! need to align/snap landmass to grid
    // for this to work
    const topLeft = toCell(landmass)
    const cells: XY[] = []
    landmass.shape.forEach((row, rowIndex) => {
        row.forEach((square, squareIndex) => {
            if (typeof square === 'undefined') {
                return
            }
            cells.push({ x: squareIndex + topLeft.x, y: rowIndex + topLeft.y })
        })
    })
    return cells
}

export const buildMatrixFromGameState = (width: number, height: number, gameState: GameState): CellMatrix => {
    const widthInCells = Math.ceil(width / TERRAIN_SQUARE_SIZE)
    const heightInCells = Math.ceil(height / TERRAIN_SQUARE_SIZE)
    const matrix: CellMatrix = []
    for (let i = 0; i < heightInCells; i++) {
        matrix.push(makeEmptyRow(widthInCells))
    }

    const cellsWithLand = gameState.land.flatMap(landToCells)
    cellsWithLand.forEach(cell => {
        try {
            matrix[cell.y][cell.x] = 1
        } catch (err) {
            console.warn(err)
        }
    })

    return matrix
}