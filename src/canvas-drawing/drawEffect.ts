import { Effect, EffectType } from "../game-state/effect";

export function drawEffect(ctx: CanvasRenderingContext2D, effect: Effect) {
    const { x, y } = effect
    switch (effect.type) {
        case EffectType.SPLASH: {
            ctx.beginPath();
            ctx.strokeStyle = 'blue'
            ctx.arc(x, y, effect.radius, 0, Math.PI * 2)
            ctx.stroke();
            break;
        }

        case EffectType.IMPACT: {
            ctx.beginPath();
            ctx.strokeStyle = 'yellow'
            ctx.fillStyle = 'red'
            ctx.arc(x, y, 3 + Math.random() * 10, 0, Math.PI * 2)
            ctx.fill();
            ctx.stroke();
            break;
        }
    }
}
