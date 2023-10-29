import { EffectType } from "./effect";
import { GameState, Side } from "./types";

export const initalState: GameState = {
    cycleNumber: 0,
    ships: [
        {
            name: 'Player McPlayerFace',
            x: 200,
            y: 200,
            h: Math.PI * .5,
            width: 20,
            length: 80,
            sailLevel: 0,
            sailLevelTarget: 0,
            cannons: [
                { side: Side.LEFT, cooldown: 0 },
                { side: Side.RIGHT, cooldown: 0 },
            ],
        },
        {
            name: 'The Flying Goose',
            x: 100,
            y: 100,
            h: Math.PI * .5,
            width: 15,
            length: 60,
            sailLevel: 0.5,
            sailLevelTarget: 0,
            cannons: [],
        },
        {
            name: 'The Dead Duck',
            x: 200,
            y: 300,
            h: Math.PI * 1.4,
            width: 30,
            length: 120,
            sailLevel: 0,
            sailLevelTarget: 0,
            cannons: []
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