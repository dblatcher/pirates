import { getCollisionCircles } from "../../game-state/ship";
import { Ship } from "../../game-state/types";
import { XY, _90_DEG_LEFT, _90_DEG_RIGHT, getXYVector, translate, translateZ } from "../../lib/geometry";
import { OffsetDrawMethods } from "../drawWithOffSet";
import { s, shipColor } from "../helpers";


type HullPoints = {
    fore: XY,
    foreLeft: XY,
    foreRight: XY,
    backLeft: XY,
    backCurveControlPoint: XY,
    backRight: XY,
}

const raise = (z: number, points: HullPoints): HullPoints => {
    if (z === 0) {
        return points
    }
    const newPoints: Partial<HullPoints> = {}
    Object.entries(points).forEach(([key, point]) => {
        newPoints[key as keyof HullPoints] = translateZ(point, z)
    })
    return newPoints as HullPoints
}

const drawHullPath = (
    ctx: CanvasRenderingContext2D,
    drawMethods: OffsetDrawMethods,
    colors: {
        fill?: string,
        stroke: string,
        width?: number,
    },
    points: {
        fore: XY,
        foreLeft: XY,
        foreRight: XY,
        backLeft: XY,
        backCurveControlPoint: XY,
        backRight: XY,
    },
    z = 0
) => {
    const { lineTo, moveTo, quadraticCurveTo } = drawMethods;
    const { fill, stroke, width = 3 } = colors
    const raised = raise(z, points)
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = stroke;
    moveTo(...s(raised.fore));
    lineTo(...s(raised.foreLeft));
    lineTo(...s(raised.backLeft));
    quadraticCurveTo(
        ...s(raised.backCurveControlPoint),
        ...s(raised.backRight)
    );
    lineTo(...s(raised.foreRight));
    lineTo(...s(raised.fore));
    ctx.stroke();
    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }
}

export const drawShipBase = (
    ctx: CanvasRenderingContext2D,
    drawMethods: OffsetDrawMethods,
    ship: Ship,
    showCollision = false
) => {
    const { h, width, length } = ship;
    const { arc } = drawMethods;

    const r = h + _90_DEG_RIGHT;
    const l = h + _90_DEG_LEFT;

    const fore = translate(getXYVector((length) / 2, h), ship);
    const foreBack = translate(fore, getXYVector(-width / 2, h));
    const foreLeft = translate(foreBack, getXYVector(width / 2, l));
    const foreRight = translate(foreBack, getXYVector(width / 2, r));

    const back = translate(ship, getXYVector(-(length / 2 - width / 2), h));
    const backLeft = translate(back, getXYVector(width / 2, l));
    const backRight = translate(back, getXYVector(width / 2, r));
    const backCurveControlPoint = translate(back, getXYVector(-width, h))

    const points = {
        fore, foreLeft, foreRight, backCurveControlPoint, backLeft, backRight
    }

    const factionColor = shipColor(ship)

    drawHullPath(ctx, drawMethods,
        { stroke: factionColor, fill: factionColor, width: 1 },
        points,
    )
    drawHullPath(ctx, drawMethods,
        { stroke: factionColor, fill: 'brown', width: 1 },
        points,
        2
    )
    drawHullPath(ctx, drawMethods,
        { stroke: factionColor, width: 4 },
        points,
        4
    )

    if (showCollision) {
        const collisionCircles = getCollisionCircles(ship);
        collisionCircles.forEach(circle => {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.fillStyle = 'rgba(255,0,0,.5)';
            arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
            ctx.fill();
        });
    }
};
