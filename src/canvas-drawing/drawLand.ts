import { Landmass, TerrainType, getLandInView } from "../game-state/land";
import { ViewPort, TERRAIN_SQUARE_SIZE } from "../game-state";
import { OffsetDrawMethods } from "./drawWithOffSet";

// TO DO - replace asset - coastlines are too thin  
const image = new Image(200, 200)
image.src = '/coastlines.png'
const fw = image.naturalWidth * 1 / 4
const fh = image.naturalHeight * 1 / 4
const t = TERRAIN_SQUARE_SIZE

const drawEastCoast = (drawingMethods: OffsetDrawMethods, x: number, y: number) => {
    drawingMethods.drawImage(image, fw * 0, fh * 2, fw, fh, x + t, y, t, t)
}
const drawNorthCoast = (drawingMethods: OffsetDrawMethods, x: number, y: number) => {
    drawingMethods.drawImage(image, fw * 1, fh * 2, fw, fh, x, y - t, t, t)
}
const drawWestCoast = (drawingMethods: OffsetDrawMethods, x: number, y: number) => {
    drawingMethods.drawImage(image, fw * 2, fh * 2, fw, fh, x - t, y, t, t)
}
const drawSouthCoast = (drawingMethods: OffsetDrawMethods, x: number, y: number) => {
    drawingMethods.drawImage(image, fw * 3, fh * 2, fw, fh, x, y + t, t, t)
}

const setLandFill = (ctx: CanvasRenderingContext2D, terrain: TerrainType) => {
    switch (terrain) {
        case TerrainType.PLAIN:
            return ctx.fillStyle = 'palegreen'
        case TerrainType.JUNGLE:
            return ctx.fillStyle = 'green'
        case TerrainType.DESERT:
            return ctx.fillStyle = 'yellow'
        case TerrainType.SWAMP:
            return ctx.fillStyle = 'burlywood'
    }
}


export function drawLand(ctx: CanvasRenderingContext2D, drawingMethods: OffsetDrawMethods, viewPort: ViewPort, land: Landmass[]) {

    const landInView = getLandInView(land, viewPort)

    landInView.forEach(landmass => {
        const isSquareAt = (x: number, y: number) => landmass.shape[y] ? typeof landmass.shape[y][x] !== 'undefined' : false
        landmass.shape.forEach((row, rowIndex) => {
            row.forEach((square, squareIndex) => {
                if (typeof square === 'undefined') {
                    return
                }
                const x = landmass.x + squareIndex * TERRAIN_SQUARE_SIZE
                const y = landmass.y + rowIndex * TERRAIN_SQUARE_SIZE
                ctx.beginPath()
                ctx.lineWidth = 1;
                setLandFill(ctx, square)
                drawingMethods.rect(x, y, TERRAIN_SQUARE_SIZE, TERRAIN_SQUARE_SIZE)
                ctx.fill()

                if (!isSquareAt(squareIndex + 1, rowIndex)) {
                    drawEastCoast(drawingMethods, x, y)
                }
                if (!isSquareAt(squareIndex, rowIndex - 1)) {
                    drawNorthCoast(drawingMethods, x, y)
                }
                if (!isSquareAt(squareIndex - 1, rowIndex)) {
                    drawWestCoast(drawingMethods, x, y)
                }
                if (!isSquareAt(squareIndex, rowIndex + 1)) {
                    drawSouthCoast(drawingMethods, x, y)
                }
            })
        })
    })
}
