import { PathFollowAutoPilot } from "../ai/path-follow-ai";
import { factions } from "./faction";
import { TerrainType } from "./land";
import { ShipProfile } from "./ship";
import { GameState, Side } from "./types";

const defaultProfile: ShipProfile = {
    maxHp: 20,
    speed: 1,
    maneuver: 1
}

const shipDefaults = {
    profile: defaultProfile,
    turnsUnimpeded: 0,
    speedLastTurn: 0,
    sailLevel: 0,
    wheel: 0,
    sailLevelTarget: 0,
    damage: 0,
}


export const initalState: GameState = {
    cycleNumber: 0,
    wind: {
        direction: Math.PI,
        force: 10,
    },
    ships: [
        {
            ...shipDefaults,
            name: 'Player McPlayerFace',
            faction: factions.grance,
            x: 200,
            y: 200,
            h: Math.PI * .5,
            damage: 5,
            width: 20,
            length: 80,
            sailLevel: 0,
            wheel: 0,
            sailLevelTarget: 0,
            cannons: [
                { side: Side.LEFT, cooldown: 0 },
                { side: Side.RIGHT, cooldown: 0 },
            ],
            id: 1,
            profile: {
                speed: 1.5,
                maneuver: 1.5,
                maxHp: 20
            }
        },
        {
            ...shipDefaults,
            name: 'The Flying Goose',
            faction: factions.spaim,
            x: 300,
            y: 0,
            h: Math.PI * .5,
            damage: 0,
            width: 15,
            length: 60,
            sailLevel: 0.5,
            wheel: 0,
            sailLevelTarget: 0,
            cannons: [],
            id: 2,
            profile: {
                speed: 2,
                maneuver: 1,
                maxHp: 10,
            },
            ai: new PathFollowAutoPilot(
                {
                    mission: {
                        type: 'travel',
                    },
                    destination: { x: 100, y: 500 },
                    path: [
                        // {x:350,y:40},
                        // {x:300,y:0},
                        { x: 300, y: 300 },
                        // {x:500,y:300},
                    ]
                }, 2),
        },
        {
            ...shipDefaults,
            name: 'The Dead Duck',
            x: 5,
            y: 300,
            h: Math.PI * 1.4,
            damage: 10,
            width: 30,
            length: 120,
            cannons: [],
            id: 3,
        },
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
    ]
}