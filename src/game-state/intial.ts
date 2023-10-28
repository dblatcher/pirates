import { EffectType } from "./effect";
import { GameState } from "./types";

export const initalState: GameState = {
    ships: [
        {
            x: 200,
            y: 200,
            h: Math.PI * .5,
            width: 20,
            length: 80,
            sailLevel: 0,
            cannonsCooldown: 0,
        },
        {
            name: 'The Flying Goose',
            x: 100,
            y: 100,
            h: Math.PI * .5,
            width: 15,
            length: 40,
            sailLevel: 0.5,
            cannonsCooldown: 0,
        },
        {
            name: 'The Dead Duck',
            x: 200,
            y: 300,
            h: Math.PI * 1.4,
            width: 20,
            length: 120,
            sailLevel: 0,
            cannonsCooldown: 0,
        },
    ],
    projectiles: [],
    effects: [
        {
            type: EffectType.SPLASH,
            x: 100,
            y: 100,
            radius: 1,
            timeLeft: 50
        }
    ]
}