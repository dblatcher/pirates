import { AttackAutoPilot, PathFollowAutoPilot } from "../ai";
import { EscortAutoPilot } from "../ai/escort-ai";
import { GameState } from "../game-state";
import { TerrainType } from "../game-state/land";
import { makeDefaultShip, makeFrigateShip } from "../game-state/ship";
import { makeTownWithForts } from "../game-state/towns";
import { InitialConditions } from "../initial-conditions";
import { _DEG } from "../lib/geometry";


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
            y: 1200,
            h: _DEG * 50,
            id: 1,
            damage: 0,
            sailLevelTarget: 0,
            sailLevel: 0
        }),
        makeDefaultShip({
            name: 'Wingman',
            faction: 'grance',
            id: 15,
            x: 1600,
            y: 1300,
            h: 0,
            // damage:15,
            ai: new EscortAutoPilot(1, 15, true)
        }),
        makeDefaultShip({
            name: 'The Flying Goose',
            faction: 'spaim',
            x: 300,
            y: 0,
            h: Math.PI * .5,
            width: 15,
            length: 60,
            id: 2,
            ai: new PathFollowAutoPilot(
                {
                    mission: {
                        type: 'travel',
                    },
                    destination: { x: 100, y: 500 },
                    path: []
                }, 2, false),
        }),
        makeFrigateShip({
            id: 3,
            name: 'The Dead Duck',
            x: 1550,
            y: 300,
            h: Math.PI * 1.4,
            damage: 10,
        }),
        makeDefaultShip({
            name: 'Spaimish Patrol',
            id: 14,
            x: 600,
            y: 1100,
            h: _DEG * 30,
            faction: 'spaim',
            ai: new AttackAutoPilot({
                mission: {
                    type: 'patrol', waypoints: [
                        { x: 700, y: 1100 },
                        { x: 700, y: 650 },
                        { x: 400, y: 600 },
                        { x: 400, y: 1000 },
                    ]
                },
                path: [],
            }, 14, true)
        }),
        makeDefaultShip({
            name: 'Spaim 1',
            id: 4,
            x: 700,
            y: 500,
            h: _DEG * 30,
            faction: 'spaim',
            ai: new AttackAutoPilot({
                mission: { type: 'patrol' },
                path: [],
            }, 4, false)
        }),
        makeDefaultShip({
            name: 'Grance 1',
            id: 5,
            x: 650,
            y: 500,
            h: _DEG * 30,
            damage: 10,
            faction: 'grance',
            ai: new AttackAutoPilot({
                mission: { type: 'patrol' },
                path: [],
            }, 5, false)
        }),
    ],
    projectiles: [],
    effects: [],
    surfaceEffects: [],
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
            y: 450,
            shape: [
                [TerrainType.DESERT, TerrainType.DESERT],
                [TerrainType.DESERT],
                [TerrainType.DESERT],
                [TerrainType.DESERT, TerrainType.DESERT],
                [TerrainType.DESERT, TerrainType.DESERT],
            ]
        },
        {
            x: 550,
            y: 750,
            shape: [
                [TerrainType.DESERT, TerrainType.DESERT],
                [TerrainType.DESERT, TerrainType.DESERT, TerrainType.DESERT],
                [TerrainType.DESERT, undefined, TerrainType.DESERT],
                [TerrainType.DESERT, TerrainType.DESERT],
                [TerrainType.DESERT, TerrainType.DESERT],
            ]
        },
        {
            x: 600,
            y: 1300,
            shape: [
                [undefined, undefined, undefined, TerrainType.JUNGLE, TerrainType.JUNGLE],
                [undefined, undefined, undefined, TerrainType.JUNGLE, TerrainType.JUNGLE],
                [undefined, undefined, undefined, TerrainType.JUNGLE, TerrainType.JUNGLE],
                [undefined, undefined, undefined, TerrainType.JUNGLE, TerrainType.JUNGLE, TerrainType.JUNGLE],
                [undefined, undefined, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.JUNGLE, TerrainType.JUNGLE],
                [undefined, undefined, undefined, TerrainType.PLAIN, TerrainType.JUNGLE, TerrainType.JUNGLE],
            ]
        }
    ],
    towns: [
        makeTownWithForts({
            faction: 'grance',
            x: 150,
            y: 150,
            id: 1,
            name: 'La Groupelle',
            defences: 1,
            profile: {
                maxDefences: 100,
                maxGarrison: 25,
            },
            invasions: [],
            garrison: 20,
        }, [
            { x: 0, y: 100 },
            { x: -50, y: -50 },
        ]),
        makeTownWithForts({
            faction: 'spaim',
            x: 600,
            y: 800,
            id: 2,
            name: 'Villa della Canto',
        }, [
            { x: -25, y: -100 },
            { x: -125, y: 0 },
            { x: 125, y: 0 },
            { x: 175, y: 0 },
            { x: 225, y: 0 },
        ]),
    ]
}

export const demoOne: InitialConditions = {
    gameState: initalState,
    mapHeight: 1800,
    mapWidth: 2400,
}