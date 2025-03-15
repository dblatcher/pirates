import { DrawSpriteFunction, OffsetDrawMethods } from "@dblatcher/sprite-canvas";
import { AssetKey } from "../assets";
import { AssetMap } from "../context/asset-context";
import { TERRAIN_SQUARE_SIZE, ViewPort } from "../game-state";
import { CoastLines, Landmass, TerrainType, getLandInView } from "../game-state/land";
import { sum } from "../lib/util";


const setLandFill = (ctx: CanvasRenderingContext2D, terrain: TerrainType) => {
    switch (terrain) {
        case TerrainType.PLAIN:
            return ctx.fillStyle = 'greenyellow'
        case TerrainType.JUNGLE:
            return ctx.fillStyle = 'burlywood'
        case TerrainType.DESERT:
            return ctx.fillStyle = 'yellow'
        case TerrainType.SWAMP:
            return ctx.fillStyle = 'burlywood'
    }
}

class CoastLinePlotter {
    private drawingMethods: OffsetDrawMethods
    private image: HTMLImageElement
    constructor(drawingMethods: OffsetDrawMethods, image: HTMLImageElement) {
        this.drawingMethods = drawingMethods
        this.image = image
    }

    drawCoasts(coastLines: CoastLines, x: number, y: number) {
        const { plotCoastlineSpriteFunc } = this
        switch (this.coastlinesToBinary(coastLines)) {
            case 0b0111: return plotCoastlineSpriteFunc(0, 0)(x, y)
            case 0b1110: return plotCoastlineSpriteFunc(1, 0)(x, y)
            case 0b1011: return plotCoastlineSpriteFunc(2, 0)(x, y)
            case 0b1101: return plotCoastlineSpriteFunc(3, 0)(x, y)

            case 0b1001: return plotCoastlineSpriteFunc(0, 1)(x, y)
            case 0b1010: return plotCoastlineSpriteFunc(1, 1)(x, y)
            case 0b0110: return plotCoastlineSpriteFunc(2, 1)(x, y)
            case 0b0101: return plotCoastlineSpriteFunc(3, 1)(x, y)

            case 0b0001: return plotCoastlineSpriteFunc(0, 2)(x, y)
            case 0b0100: return plotCoastlineSpriteFunc(1, 2)(x, y)
            case 0b0010: return plotCoastlineSpriteFunc(2, 2)(x, y)
            case 0b1000: return plotCoastlineSpriteFunc(3, 2)(x, y)

            case 0b1111: return plotCoastlineSpriteFunc(0, 3)(x, y)
            case 0b1100: return plotCoastlineSpriteFunc(1, 3)(x, y)
            case 0b0011: return plotCoastlineSpriteFunc(2, 3)(x, y)
        }
    }

    private coastlinesToBinary(coastLines: CoastLines): number {
        const bit = (v: boolean, p: number) => v ? 2 ** p : 0
        return sum([
            bit(coastLines.north, 3),
            bit(coastLines.south, 2),
            bit(coastLines.east, 1),
            bit(coastLines.west, 0),
        ])
    }

    private plotCoastlineSpriteFunc = (fx: number, fy: number) => (x: number, y: number) => {
        const fw = this.image.naturalWidth * 1 / 4
        const fh = this.image.naturalHeight * 1 / 4
        this.drawingMethods.drawImage(this.image, fw * fx, fh * fy, fw, fh, x, y, TERRAIN_SQUARE_SIZE, TERRAIN_SQUARE_SIZE)
    }
}

export function drawLand(
    drawingMethods: OffsetDrawMethods,
    viewPort: ViewPort,
    land: Landmass[],
    assets: AssetMap,
    drawSprite: DrawSpriteFunction<AssetKey>,
) {
    const { ctx } = drawingMethods
    const plotter = new CoastLinePlotter(drawingMethods, assets.coastlines)
    const landInView = getLandInView(land, viewPort)

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
                plotter.drawCoasts(square.coastLines, x, y)
                if (square.type === TerrainType.JUNGLE) {
                    drawSprite({ key: 'TREES', x, y, fx: 2, fy: 3 })
                }
                if (square.type === TerrainType.PLAIN) {
                    const random = Math.random()
                    if (random > .9) {
                        drawSprite({ key: 'TREES', x, y, fx: 0, fy: 0 })
                    } else if (random > .85) {
                        drawSprite({ key: 'MISC', x, y, fx: 1, fy: 0 })
                    }
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
                plotter.drawCoasts(coastSquare, x, y)
            })
        })
    })
}
