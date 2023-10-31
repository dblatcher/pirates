import { Landmass, TERRAIN_SQUARE_SIZE } from "./model";
import { Rect, doRectsIntersect } from "../../lib/geometry";
import { ViewPort } from "../types";


export const getBoundingRect = (landmass: Landmass, margin = 0): Rect => {
    const height = landmass.shape.length * TERRAIN_SQUARE_SIZE
    const width = Math.max(...landmass.shape.map(row => row.length)) * TERRAIN_SQUARE_SIZE
    return {
        left: landmass.x - margin,
        top: landmass.y - margin,
        right: landmass.x + width + margin,
        bottom: landmass.y + height + margin
    }
}

//TO DO - take an array of masses to filter
export const isInView = (landmass: Landmass, viewPort: ViewPort): boolean => {
    const landAndAreaAround = getBoundingRect(landmass, 20)
    const viewPortRect: Rect = {
        left: viewPort.x,
        top: viewPort.y,
        right: viewPort.x + viewPort.width,
        bottom: viewPort.y + viewPort.height
    }
    return doRectsIntersect(viewPortRect, landAndAreaAround)
}
