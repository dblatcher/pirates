import { AStarFinder } from "astar-typescript";
import { XY } from "../geometry";
import { CellMatrix } from "./types";



// const invertMatrix = (cellMatrix: CellMatrix): CellMatrix => {
//     return cellMatrix
//         .map(row => row.map(cell => cell))
//         .reverse()
// }

const isOutOfBounds = (cell: XY, matrix: CellMatrix): boolean => {
    return cell.x >= matrix[0].length ||
        cell.y >= matrix.length ||
        cell.x < 0 ||
        cell.y < 0
}

export function findPath(start: XY, goal: XY, matrix: CellMatrix, cellSize: number): XY[] {

    const toCell = (point: XY): XY => {
        return {
            x: Math.floor(point.x / cellSize),
            y: Math.floor(point.y / cellSize)
        }
    }
    const toPoint = (pathPair: [number, number]): XY => {
        return {
            x: (pathPair[0] + .5) * cellSize,
            y: (pathPair[1] + .5) * cellSize
        }
    }

    const startCell = toCell(start)
    const goalCell = toCell(goal)

    if (isOutOfBounds(startCell, matrix)) {
        return []
    }
    if (isOutOfBounds(goalCell, matrix)) {
        return []
    }

    const finder = new AStarFinder({
        grid: { matrix },
        includeEndNode: true,
        diagonalAllowed: false,
    })
    const pathPairs = finder.findPath(startCell, goalCell);

    if (pathPairs.length === 0) {
        return []
    }

    const pathPoints = (pathPairs as [number, number][]).map(toPoint)
    return [...pathPoints, goal]
}
