import { XY, getDistance, getHeading, getVectorFrom, getXYVector, translate } from "typed-geometry";
import { TERRAIN_SQUARE_SIZE } from "../../game-state";
import { CellMatrix } from "./types";
import { toCell } from "./util";


const step = TERRAIN_SQUARE_SIZE / 2

const checkIfCellIsLand = ({ x, y }: XY, cellMatrix: CellMatrix): boolean | undefined => {
    try {
        return !!cellMatrix[y][x]
    } catch {
        return undefined
    }
}


export const isDirectPathTo = (
    targetPoint: XY,
    start: XY,
    cellMatrix: CellMatrix,
): boolean => {
    const distanceInSteps = Math.floor(getDistance(start, targetPoint) / step)
    const stepVector = getXYVector(step, getHeading(getVectorFrom(start, targetPoint)))

    let previousPoint = start
    for (let i = 1; i < distanceInSteps; i++) {
        const nextPoint = translate(previousPoint, stepVector)
        if (checkIfCellIsLand(toCell(nextPoint), cellMatrix) === true) {
            return false
        }
        previousPoint = nextPoint
    }

    return true
}