import { EscortAutoPilot } from "../ai/escort-ai";
import { HunterAi, MissonAi } from "../ai/mission-ai";
import { TerrainType } from "../game-state/land";
import { GameState } from "../game-state/model";
import { InitialConditions, makeDefaultShip, makeFrigateShip } from "../game-state/ship";
import { _DEG, xy } from "../lib/geometry";


const initalState: GameState = {
    cycleNumber: 0,
    playerId: 1,
    wind: {
        direction: _DEG * 90,
        force: 10,
    },
    ships: [
        makeFrigateShip({
            name: 'Player McPlayerFace',
            faction: 'grance',
            x: 1000,
            y: 400,
            h: _DEG * -90,
            id: 1,
            damage: 0,
            sailLevelTarget: 0,
            sailLevel: 0
        }),
        makeDefaultShip({
            name: 'follower one',
            faction: 'spaim',
            id: 15,
            x: 1250,
            y: 1200,
            h: 180 * _DEG,
            damage: 19,
            ai: new HunterAi(1, 16, true)
        }),
        makeDefaultShip({
            name: 'follower two',
            faction: 'grance',
            id: 16,
            x: 1350,
            y: 1500,
            h: 0 * _DEG,
            damage: 12,
            ai: new EscortAutoPilot(15, 16, false)
        }),
        makeDefaultShip({
            name: 'The Flying Goose',
            faction: 'grance',
            x: 600,
            y: 200,
            h: Math.PI * .5,
            width: 15,
            length: 60,
            id: 2,
            ai: new MissonAi({
                mission: {
                    type: 'patrol', waypoints: [
                        xy(800, 200), xy(600, 210)
                    ]
                }, path: [
                ],
            }, 2, false)
        }),
        makeDefaultShip({
            id: 27,
            faction: 'grance',
            name: 'patrol with no path',
            x: 650,
            y: 750,
            h: _DEG * 184,
            ai: new MissonAi({
                mission: {
                    type: 'travel', waypoints: [
                        xy(650, 650),
                        xy(650, 750),
                    ]
                }, path: [
                ],
            }, 27, true)
        }),
        makeFrigateShip({
            id: 3,
            name: 'The Dead Duck',
            x: 550,
            y: 650,
            h: _DEG * 0,
            damage: 0,
        }),

    ],
    projectiles: [],
    effects: [],
    land: [
        {
            x: 1000,
            y: 1000,
            shape: [
                [TerrainType.PLAIN, TerrainType.SWAMP, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN],
                [TerrainType.PLAIN, TerrainType.SWAMP, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN],
                [TerrainType.PLAIN, undefined, undefined, undefined, undefined, undefined, undefined, TerrainType.PLAIN],
                [TerrainType.PLAIN, undefined, undefined, undefined, undefined, undefined, undefined, TerrainType.PLAIN],
                [TerrainType.PLAIN, undefined, undefined, undefined, undefined, undefined, undefined, TerrainType.PLAIN],
                [TerrainType.PLAIN, undefined, undefined, undefined, undefined, undefined, undefined, TerrainType.PLAIN],
                [TerrainType.PLAIN, TerrainType.SWAMP, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN],
                [TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN],
            ]
        },
        {
            x: 400,
            y: 500,
            shape: [
                [TerrainType.PLAIN, TerrainType.SWAMP, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN],
                [TerrainType.PLAIN, undefined, undefined, undefined, undefined, undefined, undefined, TerrainType.PLAIN],
                [TerrainType.PLAIN, undefined, undefined, undefined, undefined, undefined, undefined, TerrainType.PLAIN],
                [TerrainType.PLAIN, undefined, undefined, undefined, undefined, undefined, undefined, TerrainType.PLAIN],
                [TerrainType.PLAIN, undefined, undefined, undefined, undefined, undefined, undefined, TerrainType.PLAIN],
                [TerrainType.PLAIN, undefined, undefined, undefined, undefined, undefined, undefined, TerrainType.PLAIN],
                [TerrainType.PLAIN, TerrainType.SWAMP, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN],
            ]
        },
        {
            x: 550, y: 150,
            shape: [
                [TerrainType.PLAIN]
            ]
        },
        {
            x: 850, y: 250,
            shape: [
                [TerrainType.PLAIN]
            ]
        }
    ],
    towns: [
    ]
}

export const aiTrial: InitialConditions = {
    gameState: initalState,
    mapHeight: 1800,
    mapWidth: 2400,
}