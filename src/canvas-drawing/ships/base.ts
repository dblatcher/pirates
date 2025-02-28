import { CYCLES_TO_SINK, SINKING_DISTANCE, Ship } from "../../game-state";
import { getCollisionCircles } from "../../game-state/ship";
import { colors, rgba } from "../../lib/Color";
import { XY, _90_DEG_LEFT, _90_DEG_RIGHT, getXYVector, translate, translateZ } from "../../lib/geometry";
import { OffsetDrawMethods } from "@dblatcher/sprite-canvas";
import { getFactionColor, s } from "../helpers";


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

const fadeAsSinking = (sinking: number): number => {
    return .7 - .8 * (sinking / CYCLES_TO_SINK)
}

const getSinkDistance = (sinking: number): number => {
    return -sinking * (SINKING_DISTANCE / CYCLES_TO_SINK)
}

export const drawShipBase = (
    ctx: CanvasRenderingContext2D,
    drawMethods: OffsetDrawMethods,
    ship: Ship,
    showCollision = false,
    sinking = 0
) => {
    const { h, width, length } = ship;
    const { arc } = drawMethods;

    const r = h + _90_DEG_RIGHT;
    const l = h + _90_DEG_LEFT;

    const surfaceFore = translate(getXYVector((length) / 2, h), ship);
    const fore = sinking ? translateZ(surfaceFore, getSinkDistance(sinking)) : surfaceFore
    const foreBack = translate(fore, getXYVector(-width / 2, h));
    const foreLeft = translate(translate(foreBack, getXYVector(width / 2, l)), getXYVector(-length * .1, h));
    const foreRight = translate( translate(foreBack, getXYVector(width / 2, r)), getXYVector(-length * .1, h));

    const surfaceBack = translate(ship, getXYVector(-(length / 2 - width / 2), h));
    const back = sinking ? translateZ(surfaceBack, getSinkDistance(sinking)) : surfaceBack
    const backLeft = translate(back, getXYVector(width / 2, l));
    const backRight = translate(back, getXYVector(width / 2, r));
    const backCurveControlPoint = translate(back, getXYVector(-width, h))

    const points = {
        fore, foreLeft, foreRight, backCurveControlPoint, backLeft, backRight
    }

    const opacity = sinking ? fadeAsSinking(sinking) : 1
    const factionColor = rgba(getFactionColor(ship), opacity)

    drawHullPath(ctx, drawMethods,
        { stroke: factionColor, fill: factionColor, width: 1 },
        points,
    )
    drawHullPath(ctx, drawMethods,
        { stroke: factionColor, fill: rgba(colors.BROWN, opacity), width: 1 },
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
