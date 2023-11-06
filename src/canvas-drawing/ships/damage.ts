import { Ship } from "../../game-state/types";
import { XY, _DEG, getXYVector, translate } from "../../lib/geometry";
import { OffsetDrawMethods } from "../drawWithOffSet";
import { s } from "../helpers";


const drawFlame = (
    ctx: CanvasRenderingContext2D,
    drawMethods: OffsetDrawMethods,
    base: XY,
    gameCycle: number,
) => {
    const { lineTo, moveTo } = drawMethods;
    const mod10 = gameCycle % 10
    const mod7h = gameCycle / 2 % 7
    const flameSize = .25 * (50 + mod10)
    const up = _DEG * 135

    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'yellow';

    moveTo(...s(base));
    lineTo(...s(
        translate(base, getXYVector(flameSize * .5, up + _DEG * (30 - mod7h)))
    ))
    lineTo(...s(
        translate(base, getXYVector(flameSize * 1, up + _DEG * (10 + mod10 * 2)))
    ))
    lineTo(...s(
        translate(base, getXYVector(flameSize * .7, up + _DEG * (5 - mod10 * 2)))
    ))
    lineTo(...s(
        translate(base, getXYVector(flameSize * 1, up + _DEG * -(10 - mod7h * 2)))
    ))
    lineTo(...s(
        translate(base, getXYVector(flameSize * .5, up - _DEG * (30 + mod10)))
    ))
    lineTo(...s(base));
    ctx.stroke();
    ctx.fill();

}

const flamePositions = [
    0.3,
    -0.1,
    0,
    -0.4
]


export const drawDamage = (
    ctx: CanvasRenderingContext2D,
    drawMethods: OffsetDrawMethods,
    ship: Ship,
    gameCycle: number,
) => {
    const { damage, profile, length, h } = ship;
    if (!damage) {
        return
    }

    const damageLevel = damage / profile.maxHp
    if (damageLevel >= .8) {
        drawFlame(ctx, drawMethods, translate(ship, getXYVector(length * flamePositions[0], h)), gameCycle)
    }
    if (damageLevel >= .6) {
        drawFlame(ctx, drawMethods, translate(ship, getXYVector(length * flamePositions[1], h)), gameCycle)
    }
    if (damageLevel >= .4) {
        drawFlame(ctx, drawMethods, translate(ship, getXYVector(length * flamePositions[2], h)), gameCycle)
    }
    if (damageLevel >= .2) {
        drawFlame(ctx, drawMethods, translate(ship, getXYVector(length * flamePositions[3], h)), gameCycle)
    }
};
