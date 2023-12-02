import { Effect, EffectType } from "../game-state/effect";
import { colors, rgba } from "../lib/Color";
import { OffsetDrawMethods } from "./drawWithOffSet";

export function drawEffect(ctx: CanvasRenderingContext2D, drawingMethods: OffsetDrawMethods, effect: Effect) {
    const { x, y } = effect
    const { arc } = drawingMethods

    switch (effect.type) {
        case EffectType.SPLASH: {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'white'
            arc(x, y, effect.radius, 0, Math.PI * 2)
            ctx.stroke();
            break;
        }

        case EffectType.IMPACT: {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'yellow'
            ctx.fillStyle = 'red'
            arc(x, y, 3 + Math.random() * 10, 0, Math.PI * 2)
            ctx.fill();
            ctx.stroke();
            break;
        }

        case EffectType.GROUNDHIT: {
            const opacity = effect.timeLeft >= 20 ? 1 : effect.timeLeft / 20
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.fillStyle = rgba(colors.BLACK, opacity)
            arc(x, y, 3, 0, Math.PI * 2)
            ctx.fill();

            effect.particles.forEach(particle => {
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.strokeStyle = rgba(colors.GRAY, opacity)
                arc(x + particle.x, y + particle.y, opacity, 0, Math.PI * 2)
                ctx.stroke();
            })
            break;
        }
    }
}
