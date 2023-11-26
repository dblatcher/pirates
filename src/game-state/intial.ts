import { AttackAutoPilot, PathFollowAutoPilot } from "../ai";
import { _DEG } from "../lib/geometry";
import { factions } from "./faction";
import { TerrainType } from "./land";
import { makeDefaultShip, makeFrigateShip } from "./ship";
import { GameState } from "./model";
import { makeTownWithForts } from "./towns";


export const initalState: GameState = {
    cycleNumber: 0,
    playerId: 1,
    wind: {
        direction: _DEG * 90,
        force: 10,
    },
    ships: [
        makeFrigateShip({
            name: 'Player McPlayerFace',
            faction: factions.grance,
            x: 130,
            y: 30,
            h: Math.PI * .5,
            id: 1,
            damage: 20,
        }),
        makeDefaultShip({
            name: 'The Flying Goose',
            faction: factions.spaim,
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
            x: 550,
            y: 300,
            h: Math.PI * 1.4,
            damage: 10,
        }),
        makeDefaultShip({
            name: 'Spaim 1',
            id: 4,
            x: 700,
            y: 500,
            h: _DEG * 30,
            faction: factions.spaim,
            ai: new AttackAutoPilot({
                mission: { type: 'attack' },
                path: [],
            }, 4, false)
        }),
        makeDefaultShip({
            name: 'Grance 1',
            id: 5,
            x: 650,
            y: 500,
            h: _DEG * 30,
            faction: factions.grance,
            ai: new AttackAutoPilot({
                mission: { type: 'attack' },
                path: [],
            }, 5, false)
        }),
    ],
    projectiles: [],
    effects: [],
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
            faction: factions.grance,
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
            faction: factions.spaim,
            x: 600,
            y: 800,
            id: 2,
            name: 'Villa della Canto',
        }, [
            { x: -25, y: -100 },
            { x: -125, y: 0 },
            { x: 125, y: 0 }
        ]),
    ]
}