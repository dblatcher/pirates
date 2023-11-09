export type XY = { x: number, y: number }
export type Circle = { x: number, y: number, r: number }
export type Rect = { top: number, left: number, bottom: number, right: number }

export const _90_DEG_LEFT = Math.PI * .5
export const _90_DEG_RIGHT = Math.PI * -.5
export const _360_DEG = Math.PI * 2
export const _DEG = Math.PI / 180

function getVectorX(magnitude: number, direction: number) { return magnitude * Math.sin(direction) }
function getVectorY(magnitude: number, direction: number) { return magnitude * Math.cos(direction) }

export function getXYVector(magnitude: number, direction: number): XY { return { x: getVectorX(magnitude, direction), y: getVectorY(magnitude, direction) } }

export const getHeading = (vector: XY): number => {
    const { x, y } = vector
    if (x == 0 && y == 0) { return 0; }
    if (y == 0 && x != 0) {
        return x < 0 ? Math.PI * 1.5 : Math.PI * 0.5;
    }
    if (x == 0 && y != 0) {
        return y > 0 ? 0 : Math.PI * 1;
    }
    return (y > 0) ? Math.atan(x / y) : Math.PI + Math.atan(x / y)
}


export const normaliseHeading = (h: number): number => {
    const hr = h % (_360_DEG)
    return hr > 0 ? hr : (_360_DEG) + hr
}

export const translate = (position: XY, vector: XY): XY => ({
    x: position.x + vector.x,
    y: position.y + vector.y,
})

export const translateZ = (position: XY, z: number): XY => ({
    x: position.x + z,
    y: position.y - z
})

export const getDistance = (p1: XY, p2: XY): number => {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
}

export const isPointInsideRect = (point: XY, rect: Rect): boolean => {
    const { top, left, bottom, right } = rect
    return !(
        point.y <= top ||
        point.y >= bottom ||
        point.x <= left ||
        point.x >= right
    )
}

export const doRectsIntersect = (r1: Rect, r2: Rect): boolean => {
    return isPointInsideRect({ x: r1.left, y: r1.top }, r2) ||
        isPointInsideRect({ x: r1.left, y: r1.bottom }, r2) ||
        isPointInsideRect({ x: r1.right, y: r1.top }, r2) ||
        isPointInsideRect({ x: r1.right, y: r1.bottom }, r2) ||
        isPointInsideRect({ x: r2.left, y: r2.top }, r1) ||
        isPointInsideRect({ x: r2.left, y: r2.bottom }, r1) ||
        isPointInsideRect({ x: r2.right, y: r2.top }, r1) ||
        isPointInsideRect({ x: r2.right, y: r2.bottom }, r1)
}

export const doCircleIntersect = (c1: Circle, c2: Circle): boolean => {
    return getDistance(c1, c2) < c1.r + c2.r
}

