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
    center?: boolean;
}

export const drawSpriteFunc = (drawingMethods: OffsetDrawMethods, assets: AssetMap) =>
    ({ key, x, y, fx = 0, fy = 0, width = TERRAIN_SQUARE_SIZE, height = TERRAIN_SQUARE_SIZE, center }: SpriteParams) => {
        const assetData = assetParams[key];
        const img = assets[key];
        const spriteDims = assetData.sprites ?? { rows: 1, cols: 1 }
        const frameWidth = img.naturalWidth / spriteDims.cols
        const frameHeight = img.naturalHeight / spriteDims.rows
        const adjustedX = center ? x - width / 2 : x;
        const adjustedY = center ? y - height / 2 : y;

        drawingMethods.drawImage(
            img,
            fx * frameWidth,
            fy * frameHeight,
            frameWidth, frameHeight,
            adjustedX,
            adjustedY,
            width, height
        )
    }