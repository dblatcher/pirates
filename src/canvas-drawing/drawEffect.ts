import { Effect, EffectType } from "../game-state/effect";
import { OffsetDrawMethods } from "./drawWithOffSet";

export function drawEffect(ctx: CanvasRenderingContext2D, drawingMethods: OffsetDrawMethods, effect: Effect) {
    const { x, y } = effect

    const { arc } = drawingMethods

    switch (effect.type) {
        case EffectType.SPLASH: {
            ctx.beginPath();
            ctx.strokeStyle = 'blue'
            arc(x, y, effect.radius, 0, Math.PI * 2)
            ctx.stroke();
            break;
        }

        case EffectType.IMPACT: {
            ctx.beginPath();
            ctx.strokeStyle = 'yellow'
            ctx.fillStyle = 'red'
            arc(x, y, 3 + Math.random() * 10, 0, Math.PI * 2)
            ctx.fill();
            ctx.stroke();
            break;
        }
    }
}
