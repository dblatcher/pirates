import { TERRAIN_SQUARE_SIZE } from "../../game-state"
import { XY } from "../geometry"

export const toCell = (point: XY): XY => {
    return {
        x: Math.floor(point.x / TERRAIN_SQUARE_SIZE),
        y: Math.floor(point.y / TERRAIN_SQUARE_SIZE)
    }
}

export const toCellContaining = (point: XY): XY => ({
    x: Math.round(point.x / TERRAIN_SQUARE_SIZE),
    y: Math.round(point.y / TERRAIN_SQUARE_SIZE)
})
