import { Ship } from "../../game-state";
import { getXYVector, translate } from "../../lib/geometry";
import { drawFlame } from "../drawFlame";
import { OffsetDrawMethods } from "../drawWithOffSet";


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
