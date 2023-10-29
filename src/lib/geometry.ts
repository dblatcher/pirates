export type XY = { x: number, y: number }
export type Circle = { x: number, y: number, r: number }
export type Rect = { top: number, left: number, bottom: number, right: number }

function getVectorX(magnitude: number, direction: number) { return magnitude * Math.sin(direction) }
function getVectorY(magnitude: number, direction: number) { return magnitude * Math.cos(direction) }

export function getXYVector(magnitude: number, direction: number): XY { return { x: getVectorX(magnitude, direction), y: getVectorY(magnitude, direction) } }

export const translate = (position: XY, vector: XY): XY => ({
    x: position.x + vector.x,
    y: position.y + vector.y,
})

export const getDistance = (p1: XY, p2: XY): number => {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
}

export const isPointInsideRect = (point: XY, rect: Rect): boolean => {
    const { top, left, bottom, right } = rect
    return !(
        point.y < top ||
        point.y > bottom ||
        point.x < left ||
        point.x > right
    )
}

export const doCircleIntersect = (c1: Circle, c2: Circle): boolean => {
    return getDistance(c1, c2) < c1.r + c2.r
}