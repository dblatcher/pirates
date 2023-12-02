import { FORT_SIZE, Fort, GameState, TERRAIN_SQUARE_SIZE } from "../../game-state";
import { Landmass } from "../../game-state/land";
import { XY, translate, xy } from "../geometry";
import { CellMatrix } from "./types";


const makeEmptyRow = (widthInCells: number): (0 | 1)[] => {
    const row: (0 | 1)[] = []
    row.length = widthInCells
    row.fill(0, 0, widthInCells)
    return row
}

const makeEmptyGrid = (widthInCells: number, heightInCells: number): CellMatrix => {
    const matrix: CellMatrix = []
    for (let i = 0; i < heightInCells; i++) {
        matrix.push(makeEmptyRow(widthInCells))
    }
    return matrix
}

const toCell = (point: XY): XY => {
    return {
        x: Math.floor(point.x / TERRAIN_SQUARE_SIZE),
        y: Math.floor(point.y / TERRAIN_SQUARE_SIZE)
    }
}

const toCellContaining = (point: XY): XY => ({
    x: Math.round(point.x / TERRAIN_SQUARE_SIZE),
    y: Math.round(point.y / TERRAIN_SQUARE_SIZE)
})

// TO DO discourage sailing too close to the coast
// add forts to the matrix
// can cells have vaules other than 0|1? - check pacakage readme
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

const fortToCells = (fort: Fort): XY[] => {
    const right = toCellContaining(translate(fort, xy(FORT_SIZE / 2, 0))).x + 1
    const left = toCellContaining(translate(fort, xy(-FORT_SIZE / 2, 0))).x - 1
    const top = toCellContaining(translate(fort, xy(0, -FORT_SIZE / 2))).y - 1
    const bottom = toCellContaining(translate(fort, xy(0, FORT_SIZE / 2))).y + 1
    const cells: XY[] = []
    for (let x = left; x <= right; x++) {
        for (let y = top; y <= bottom; y++) {
            cells.push({ x, y })
        }
    }
    return cells
}




// TO DO - account for positions of forts
export const buildMatrixFromGameState = (width: number, height: number, gameState: GameState): { landAndForts: CellMatrix, land: CellMatrix } => {
    console.log('building matrix')
    const widthInCells = Math.ceil(width / TERRAIN_SQUARE_SIZE)
    const heightInCells = Math.ceil(height / TERRAIN_SQUARE_SIZE)
    const landAndFortsMatrix = makeEmptyGrid(widthInCells, heightInCells)
    const landMatrix = makeEmptyGrid(widthInCells, heightInCells)

    const cellsWithLand = gameState.land.flatMap(landToCells);
    const cellsWithForts = gameState.towns.flatMap(town => town.forts).flatMap(fortToCells);



    cellsWithLand.forEach(cell => {
        try {
            landMatrix[cell.y][cell.x] = 1
            landAndFortsMatrix[cell.y][cell.x] = 1
        } catch (err) {
            console.warn(err)
        }
    });

    cellsWithForts.forEach(cell => {
        try {
            landAndFortsMatrix[cell.y][cell.x] = 1
        } catch (err) {
            console.warn(err)
        }
    })


    return { landAndForts: landAndFortsMatrix, land: landMatrix }
}