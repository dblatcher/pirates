
type XY = { x: number, y: number }

function getVectorX(magnitude: number, direction: number) { return magnitude * Math.sin(direction) }

function getVectorY(magnitude: number, direction: number) { return magnitude * Math.cos(direction) }

export function getXYVector(magnitude: number, direction: number): XY { return { x: getVectorX(magnitude, direction), y: getVectorY(magnitude, direction) } }

export const translate = (position: XY, vector: XY): XY => ({ 
    x: position.x + vector.x, 
    y: position.y + vector.y,
})