import { coastlinesPng } from "../assets";
import { TERRAIN_SQUARE_SIZE, ViewPort } from "../game-state";
import { Landmass, TerrainType, getLandInView } from "../game-state/land";
import { OffsetDrawMethods } from "./drawWithOffSet";

// TO DO - replace asset - coastlines are too thin  
const image = new Image(200, 200)
image.src = coastlinesPng
const fw = image.naturalWidth * 1 / 4
const fh = image.naturalHeight * 1 / 4
const t = TERRAIN_SQUARE_SIZE


const plotCoastlineSpriteFunc = (fx: number, fy: number, drawingMethods: OffsetDrawMethods) => (x: number, y: number) => {
    drawingMethods.drawImage(image, fw * fx, fh * fy, fw, fh, x, y, t, t)
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
    const drawInnerEastCoast = plotCoastlineSpriteFunc(2, 2, drawingMethods)
    const drawInnerWestCoast = plotCoastlineSpriteFunc(0, 2, drawingMethods)
    const drawInnerNorthCoast = plotCoastlineSpriteFunc(3, 2, drawingMethods)
    const drawInnerSouthCoast = plotCoastlineSpriteFunc(1, 2, drawingMethods)

    landInView.forEach(landmass => {
        landmass.shape.forEach((row, rowIndex) => {
            row.forEach((square, squareIndex) => {
                if (typeof square === 'undefined') {
                    return
                }
                const x = landmass.x + squareIndex * TERRAIN_SQUARE_SIZE
                const y = landmass.y + rowIndex * TERRAIN_SQUARE_SIZE
                ctx.beginPath()
                ctx.lineWidth = 1;
                setLandFill(ctx, square.type)
                drawingMethods.rect(x, y, TERRAIN_SQUARE_SIZE, TERRAIN_SQUARE_SIZE)
                ctx.fill()

                if (square.coastLines.east) {
                    drawInnerEastCoast(x, y)
                }
                if (square.coastLines.north) {
                    drawInnerNorthCoast(x, y)
                }
                if (square.coastLines.west) {
                    drawInnerWestCoast(x, y)
                }
                if (square.coastLines.south) {
                    drawInnerSouthCoast(x, y)
                }
            })
        })

        landmass.coasts.forEach((row, rowIndex) => {
            row.forEach((coastSquare, squareIndex) => {

                if (typeof coastSquare === 'undefined') {
                    return
                }
                const x = landmass.x + (squareIndex - 1) * TERRAIN_SQUARE_SIZE
                const y = landmass.y + (rowIndex - 1) * TERRAIN_SQUARE_SIZE

                if (coastSquare.north) {
                    drawInnerNorthCoast(x, y)
                }
                if (coastSquare.south) {
                    drawInnerSouthCoast(x, y)
                }
                if (coastSquare.west) {
                    drawInnerWestCoast(x, y)
                }
                if (coastSquare.east) {
                    drawInnerEastCoast(x, y)
                }
            })
        })
    })
}
