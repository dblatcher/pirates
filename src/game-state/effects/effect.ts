import { XY } from "../../lib/geometry";
import { GameState } from "../model";

// TO DO - move to model
export enum EffectType {
    SPLASH, IMPACT, GROUNDHIT, WAVE,
}
type BaseEffect = {
    x: number;
    y: number;
    timeLeft: number;
}

type Splash = BaseEffect & {
    type: EffectType.SPLASH;
    radius: number;
}

type Impact = BaseEffect & {
    type: EffectType.IMPACT
}

type GroundHit = BaseEffect & {
    type: EffectType.GROUNDHIT
    particles: Array<XY & { v: XY }>
}

type WAVE = BaseEffect & {
    type: EffectType.WAVE
}

export type Effect = Splash | Impact | GroundHit | WAVE

export const updateEffect = (effect: Effect) => {
    effect.timeLeft = effect.timeLeft - 1
    switch (effect.type) {
        case EffectType.SPLASH:
            effect.radius = effect.radius + 0.5
            break
        case EffectType.GROUNDHIT:
            effect.particles.forEach(particle => {
                particle.y = particle.y + particle.v.y
                particle.x = particle.x + particle.v.x
            })
            break
    }
}

export const createSplash = (start: Omit<Splash, 'type'>, game: GameState) => {
    game.surfaceEffects.push({
        ...start,
        type: EffectType.SPLASH
    })
}
export const createImpact = (start: Omit<Impact, 'type'>, game: GameState) => {
    game.effects.push({
        ...start,
        type: EffectType.IMPACT
    })
}
const makeParticle = () => ({
    x: 0, y: 0, v: { y: -.5 + Math.random() * 1, x: -.5 + Math.random() * 1 }
})
export const createGroundHit = (start: Omit<GroundHit, 'type' | 'particles'>, game: GameState) => {
    game.effects.push({
        ...start,
        type: EffectType.GROUNDHIT,
        particles: [
            makeParticle(), makeParticle(), makeParticle(), makeParticle(), makeParticle(), makeParticle(), makeParticle(), makeParticle(),
        ]
    })
}