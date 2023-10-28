import { GameState } from "./types";

export enum EffectType {
    SPLASH
}
type BaseEffect = {
    type: EffectType;
    x: number;
    y: number;
    timeLeft: number;
}


export type Splash = BaseEffect & {
    radius: number;
}

export type Effect = Splash

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
