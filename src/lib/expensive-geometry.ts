import { XY, Circle, getDistance } from "./geometry"



export function doesLineSegmentCrossCircleEdge(path: [XY, XY], circle: Circle): boolean {

    const point0IsInside = isPointInsideCircle(circle, path[0])
    const point1IsInside = isPointInsideCircle(circle, path[1])

    if (point0IsInside && point1IsInside) { return false }
    if (point1IsInside != point0IsInside) { return true }

    return isPointInsideCircle(circle, closestPointOnLineSegment(...path, circle))

}

function isPointInsideCircle(circle: Circle, point: XY) {
    return getDistance(circle, point) <= circle.r
}


function closestPointOnLineSegment(segmentPoint1: XY, segmentPoint2: XY, p0: XY) {
    const v: XY = { x: segmentPoint2.x - segmentPoint1.x, y: segmentPoint2.y - segmentPoint1.y }
    const u: XY = { x: segmentPoint1.x - p0.x, y: segmentPoint1.y - p0.y }
    const vu = v.x * u.x + v.y * u.y
    const vv = v.x ** 2 + v.y ** 2
    const t = -vu / vv
    if (t >= 0 && t <= 1) return _vectorToSegment2D(t, { x: 0, y: 0 }, segmentPoint1, segmentPoint2)
    const g0 = _sqDiag2D(_vectorToSegment2D(0, p0, segmentPoint1, segmentPoint2))
    const g1 = _sqDiag2D(_vectorToSegment2D(1, p0, segmentPoint1, segmentPoint2))
    return g0 <= g1 ? segmentPoint1 : segmentPoint2
}

function _vectorToSegment2D(t: number, P: XY, A: XY, B: XY) {
    return {
        x: (1 - t) * A.x + t * B.x - P.x,
        y: (1 - t) * A.y + t * B.y - P.y,
    } as XY
}

function _sqDiag2D(P: XY) { return P.x ** 2 + P.y ** 2 }
