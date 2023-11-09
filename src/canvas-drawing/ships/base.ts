import { getCollisionCircles } from "../../game-state/ship";
import { Ship } from "../../game-state/types";
import { _90_DEG_LEFT, _90_DEG_RIGHT, getXYVector, translate } from "../../lib/geometry";
import { OffsetDrawMethods } from "../drawWithOffSet";
import { s, shipColor } from "../helpers";


export const drawShipBase = (
    ctx: CanvasRenderingContext2D,
    drawMethods: OffsetDrawMethods,
    ship: Ship,
    showCollision = false
) => {
    const { h, width, length } = ship;
    const { arc, lineTo, moveTo } = drawMethods;

    const r = h + _90_DEG_RIGHT;
    const l = h + _90_DEG_LEFT;

    const fore = translate(getXYVector((length) / 2, h), ship);
    const foreBack = translate(fore, getXYVector(-width / 2, h));
    const foreLeft = translate(foreBack, getXYVector(width / 2, l));
    const foreRight = translate(foreBack, getXYVector(width / 2, r));

    const back = translate(ship, getXYVector(-(length / 2 - width / 2), h));
    const backLeft = translate(back, getXYVector(width / 2, l));
    const backRight = translate(back, getXYVector(width / 2, r));

    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.fillStyle = 'brown';
    ctx.strokeStyle = shipColor(ship);

    moveTo(...s(fore));
    lineTo(...s(foreLeft));
    lineTo(...s(backLeft));
    // moveTo(...s(back))
    lineTo(...s(backRight));
    lineTo(...s(foreRight));
    lineTo(...s(fore));
    ctx.stroke();
    if (!showCollision) {
        ctx.fill();
    }

    ctx.beginPath();
    ctx.lineWidth = 1;
    arc(...s(back), width / 2, 0, Math.PI * 2);
    ctx.fill();

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
