import { assetParams } from "../assets"
import { AssetMap } from "../context/asset-context"
import { TERRAIN_SQUARE_SIZE } from "../game-state"
import { OffsetDrawMethods } from "./drawWithOffSet"

type SpriteParams = {
    key: keyof AssetMap;
    x: number;
    y: number;
    fx?: number;
    fy?: number;
    width?: number;
    height?: number;
}

export const drawSpriteFunc = (drawingMethods: OffsetDrawMethods, assets: AssetMap) =>
    ({ key, x, y, fx = 0, fy = 0, width = TERRAIN_SQUARE_SIZE, height = TERRAIN_SQUARE_SIZE }: SpriteParams) => {
        const asset = assetParams[key]
        const spriteDims = asset.sprites ?? { rows: 1, cols: 1 }
        const frameWidth = asset.width / spriteDims.cols
        const frameHeight = asset.height / spriteDims.rows

        drawingMethods.drawImage(
            assets[key],
            fx * frameWidth,
            fy * frameHeight,
            frameWidth, frameHeight,
            x, y,
            width, height
        )
    }