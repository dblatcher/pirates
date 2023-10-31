import { Landmass, TERRAIN_SQUARE_SIZE } from "./model";
// import { ViewPort } from "../types";
import { Rect } from "../../lib/geometry";


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

// export const isInView = (landmass: Landmass, viewPort: ViewPort): boolean => {

//     // viewport x,y is top left

//     const rect = getBoundingRect(landmass,20)

// }