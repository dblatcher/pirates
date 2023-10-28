import { GameState } from "./types";

export enum EffectType {
    SPLASH, IMPACT
}
type BaseEffect = {
    x: number;
    y: number;
    timeLeft: number;
}

export type Splash = BaseEffect & {
    type: EffectType.SPLASH;
    radius: number;
}

export type Impact = BaseEffect & {
    type: EffectType.IMPACT
}

export type Effect = Splash | Impact

export const updateEffect = (effect: Effect) => {
    effect.timeLeft = effect.timeLeft - 1
    switch (effect.type) {
        case EffectType.SPLASH:
            effect.radius = effect.radius + 0.5
            break
    }
}

export const createSplash = (start: Omit<Splash, 'type'>, game: GameState) => {
    game.effects.push({
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
