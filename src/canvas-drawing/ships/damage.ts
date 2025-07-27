import { Ship } from "../../game-state";
import { getXYVector, translate } from "typed-geometry";
import { drawFlame } from "../drawFlame";
import { OffsetDrawMethods } from "@dblatcher/sprite-canvas";


const flamePositions = [
    0.3,
    -0.1,
    0,
    -0.4
]

export const drawDamage = (
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
        drawFlame(drawMethods, translate(ship, getXYVector(length * flamePositions[0], h)), gameCycle)
    }
    if (damageLevel >= .6) {
        drawFlame(drawMethods, translate(ship, getXYVector(length * flamePositions[1], h)), gameCycle)
    }
    if (damageLevel >= .4) {
        drawFlame(drawMethods, translate(ship, getXYVector(length * flamePositions[2], h)), gameCycle)
    }
    if (damageLevel >= .2) {
        drawFlame(drawMethods, translate(ship, getXYVector(length * flamePositions[3], h)), gameCycle)
    }
};
