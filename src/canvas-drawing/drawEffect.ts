import { Effect, EffectType } from "../game-state/effects/effect";
import { colors, rgba } from "../lib/Color";
import { translate, xy } from "../lib/geometry";
import { clamp } from "../lib/util";
import { OffsetDrawMethods } from "./drawWithOffSet";
import { s } from "./helpers";
import { drawShipBase } from "./ships/base";

export function drawEffect(ctx: CanvasRenderingContext2D, drawingMethods: OffsetDrawMethods, effect: Effect) {
    const { x, y } = effect
    const { arc, lineTo, moveTo } = drawingMethods

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

        case EffectType.WAVE: {
            ctx.beginPath()
            ctx.strokeStyle = rgba(colors.WHITE, 1)
            ctx.lineWidth = 2;
            const spread = 3 + clamp(10 - effect.timeLeft, 5, 0)
            moveTo(...s(translate(effect, xy(-spread, 0))))
            lineTo(...s(translate(effect, xy(spread, 0))))
            ctx.stroke();
            break;
        }

        case EffectType.SHINKING_SHIP: {

            const sinking = clamp(effect.sink,200,0)
            console.log(sinking)

            drawShipBase(ctx, drawingMethods, effect.ship, false, sinking)
            break;

        }
    }
}
