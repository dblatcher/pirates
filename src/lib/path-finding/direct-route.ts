import { GameState, Ship, TERRAIN_SQUARE_SIZE } from "../../game-state";
import { XY, getDistance, getHeading, getVectorFrom, getXYVector, translate, xy } from "../geometry";
import { CellMatrix } from "./types";
import { toCell } from "./util";

const step = TERRAIN_SQUARE_SIZE / 2


export const isDirectPathTo = (
    targetPoint: XY,
    ship: Ship,
    gameState: GameState,
    cellMatrix: CellMatrix,
): boolean => {

    const valueAt = ({ x, y }: XY): number => {
        try {
            return cellMatrix[y][x]
        } catch {
            return -1
        }
    }

    const start = xy(ship.x, ship.y)
    const distance = Math.floor(getDistance(start, targetPoint))
    const distanceInSteps = Math.floor(distance / step)
    const stepVector = getXYVector(step, getHeading(getVectorFrom(start, targetPoint)))

    const pointsOnPath = [start]

    for (let i = 1; i < distanceInSteps; i++) {
        const lastPoint = pointsOnPath[i - 1];
        pointsOnPath.push(translate(lastPoint, stepVector))
    }

    const isLandInTheWay = pointsOnPath.some(point => {
        return valueAt(toCell(point)) === 1
    })

    if (isLandInTheWay) {
        console.log(ship.name, { isLandInTheWay })
    }
    return !isLandInTheWay
}