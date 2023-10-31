import { EffectType } from "./effect";
import { TerrainType } from "./land";
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
            wheel: 0,
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
            wheel: 0,
            sailLevelTarget: 0,
            cannons: [],
        },
        {
            name: 'The Dead Duck',
            x: 300,
            y: 300,
            h: Math.PI * 1.4,
            width: 30,
            length: 120,
            sailLevel: 0,
            wheel: 0,
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
    ],
    land: [
        {
            x: 100,
            y: 100,
            shape: [
                [TerrainType.PLAIN, TerrainType.SWAMP, TerrainType.PLAIN],
                [TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN],
                [TerrainType.DESERT, TerrainType.PLAIN],
                [TerrainType.DESERT],
                [TerrainType.DESERT],
            ]
        },
        {
            x: 150,
            y: 300,
            shape: [
                [TerrainType.DESERT, TerrainType.DESERT],
                [TerrainType.DESERT],
                [TerrainType.DESERT],
                [TerrainType.DESERT, TerrainType.DESERT],
                [TerrainType.DESERT, TerrainType.DESERT],
            ]
        },
    ]
}