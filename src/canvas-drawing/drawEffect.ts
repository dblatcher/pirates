import { Effect, EffectType } from "../game-state/effect";

export function drawEffect(ctx: CanvasRenderingContext2D, effect: Effect) {
    const { x, y, radius } = effect
    switch (effect.type) {
        case EffectType.SPLASH: {
            ctx.beginPath();
            ctx.strokeStyle = 'blue'
            ctx.arc(x, y, radius, 0, Math.PI * 2)
            ctx.stroke();
            break;
        }
    }
}
