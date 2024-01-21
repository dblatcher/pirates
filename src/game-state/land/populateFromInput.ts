import { XY, translate, xy } from "../../lib/geometry"
import { Landmass, LandmassInput, TerrainSquare } from "./model"


const buildCoastLines = (point: XY, landmassInput: LandmassInput): TerrainSquare['coastLines'] => {

    const isSquareAt = ({ x, y }: XY) => landmassInput.shape[y] ? typeof landmassInput.shape[y][x] !== 'undefined' : false
    const north = translate(point, xy(0, -1))
    const south = translate(point, xy(0, 1))
    const east = translate(point, xy(1, 0))
    const west = translate(point, xy(-1, 0))

    return {
        north: !isSquareAt(north),
        south: !isSquareAt(south),
        east: !isSquareAt(east),
        west: !isSquareAt(west),
    }
}

export const inputToLandmass = (landmassInput: LandmassInput): Landmass => {
    const { x, y, shape: inputShape } = landmassInput
    const shape: Landmass['shape'] = inputShape.map((row, rowIndex) =>
        row.map((value, colIndex) => typeof value === 'undefined' ? value : {
            type: value,
            coastLines: buildCoastLines(xy(colIndex, rowIndex), landmassInput),
        })
    )
    return {
        x, y, shape
    }
}