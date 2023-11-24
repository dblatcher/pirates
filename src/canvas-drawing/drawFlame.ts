import { XY, _DEG, translate, getXYVector } from "../lib/geometry";
import { OffsetDrawMethods } from "./drawWithOffSet";
import { s } from "./helpers";

export const drawFlame = (
    ctx: CanvasRenderingContext2D,
    drawMethods: OffsetDrawMethods,
    base: XY,
    gameCycle: number,
    flameScale = 1,
) => {
    const { lineTo, moveTo } = drawMethods;
    const mod10 = gameCycle % 10
    const mod7h = gameCycle / 2 % 7
    const flameSize = .25 * (50 + mod10) * flameScale
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