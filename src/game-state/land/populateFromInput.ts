import { XY, translate, xy } from "../../lib/geometry"
import { CoastLines, Landmass, LandmassInput, TerrainSquare } from "./model"


type SquareAtFunc = { (point: XY): boolean }

const isSquareAtFunc = (landmassInput: LandmassInput): SquareAtFunc =>
    ({ x, y }: XY) =>
        landmassInput.shape[y] ? typeof landmassInput.shape[y][x] !== 'undefined' : false

const buildInnerCoastLines = (point: XY, isSquareAt: SquareAtFunc): TerrainSquare['coastLines'] => {
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

const buildCoasts = (inputShape: LandmassInput['shape'], isSquareAt: SquareAtFunc): Landmass['coasts'] => {
    const coasts: Landmass['coasts'] = []

    const gridWidth = Math.max(...inputShape.map(row => row.length))

    for (let rowIndex = 0; rowIndex < inputShape.length + 2; rowIndex++) {
        const outputRow: (CoastLines | undefined)[] = []
        for (let colIndex = 0; colIndex < gridWidth + 2; colIndex++) {

            const gridX = colIndex - 1
            const gridY = rowIndex - 1

            if (isSquareAt(xy(gridX, gridY))) {
                outputRow.push(undefined)
                continue
            }

            outputRow.push({
                north: isSquareAt(xy(gridX, gridY - 1)),
                south: isSquareAt(xy(gridX, gridY + 1)),
                west: isSquareAt(xy(gridX - 1, gridY)),
                east: isSquareAt(xy(gridX + 1, gridY)),
            })
        }
        coasts.push(outputRow)
    }
    return coasts
}

export const inputToLandmass = (landmassInput: LandmassInput): Landmass => {
    const { x, y, shape: inputShape } = landmassInput
    const isSquareAt = isSquareAtFunc(landmassInput)

    const shape: Landmass['shape'] = inputShape.map((row, rowIndex) =>
        row.map((value, colIndex) => typeof value === 'undefined' ? value : {
            type: value,
            coastLines: buildInnerCoastLines(xy(colIndex, rowIndex), isSquareAt),
        })
    )

    const coasts = buildCoasts(inputShape, isSquareAt)

    // console.table(coasts.map(rows => rows.map(sq => sq?.north ?? undefined)))
    return {
        x, y, shape, coasts
    }
}