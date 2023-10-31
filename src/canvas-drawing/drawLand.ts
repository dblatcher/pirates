import { Landmass, isInView, TERRAIN_SQUARE_SIZE, TerrainType } from "../game-state/land";
import { ViewPort } from "../game-state/types";
import { OffsetDrawMethods } from "./drawWithOffSet";


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

    const landInView = land.filter(landmass => isInView(landmass, viewPort))

    landInView.forEach(landmass => {

        landmass.shape.forEach((row, rowIndex) => {
            row.forEach((square, squareIndex) => {

                const x = landmass.x + squareIndex * TERRAIN_SQUARE_SIZE
                const y = landmass.y + rowIndex * TERRAIN_SQUARE_SIZE
                ctx.beginPath()
                setLandFill(ctx, square)
                drawingMethods.rect(x, y, TERRAIN_SQUARE_SIZE, TERRAIN_SQUARE_SIZE)
                ctx.fill()

            })
        })


    })

}
