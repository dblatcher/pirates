import { Landmass, TERRAIN_SQUARE_SIZE } from "./model";
import { Rect, XY, doRectsIntersect, isPointInsideRect } from "../../lib/geometry";
import { ViewPort } from "../model/types";
import { viewPortToRect } from "../helpers";


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


export const isLandInView = (landmass: Landmass, viewPort: ViewPort): boolean => {
    const viewPortRect= viewPortToRect(viewPort)
    return doRectsIntersect(viewPortRect, getBoundingRect(landmass, 20))
}

export const getLandInView = (landmasses: Landmass[], viewPort: ViewPort): Landmass[] => {
    const viewPortRect= viewPortToRect(viewPort)
    return landmasses.filter(landmass =>
        doRectsIntersect(viewPortRect, getBoundingRect(landmass, 20))
    )
}

export const isLandAt = (point: XY, land: Landmass[]): boolean => {

    const landToTest = land.filter(landmass => isPointInsideRect(point, getBoundingRect(landmass)))

    return landToTest.some(landmass => {
        const sqx = Math.floor((point.x - landmass.x)/TERRAIN_SQUARE_SIZE)
        const sqy = Math.floor((point.y - landmass.y)/TERRAIN_SQUARE_SIZE)
        const row = landmass.shape[sqy]
        if (!row) {
            return false
        }
        const square = row[sqx]
        return typeof square !== 'undefined'
    })
}