import { assetParams } from "../assets"
import { AssetMap } from "../context/asset-context"
import { TERRAIN_SQUARE_SIZE } from "../game-state"
import { OffsetDrawMethods } from "./drawWithOffSet"

export const drawSpriteFunc = (drawingMethods: OffsetDrawMethods, assets: AssetMap) =>
    (key: keyof AssetMap, x: number, y: number, fx = 0, fy = 0) => {
        const asset = assetParams[key]
        const spriteDims = asset.sprites ?? { rows: 1, cols: 1 }
        const frameWidth = asset.width / spriteDims.cols
        const frameHeight = asset.height / spriteDims.rows
        drawingMethods.drawImage(assets[key], fx * frameWidth, fy * frameHeight, 20, 20, x, y, TERRAIN_SQUARE_SIZE, TERRAIN_SQUARE_SIZE)
    }