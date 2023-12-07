import { PathFollowAutoPilot } from "../ai";
import { EscortAutoPilot } from "../ai/escort-ai";
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
            x: 1060,
            y: 920,
            h: _DEG * -90,
            id: 1,
            damage: 0,
            sailLevelTarget: 0,
            sailLevel: 0
        }),
        makeDefaultShip({
            name: 'Wingman',
            faction: 'grance',
            id: 15,
            x: 1050,
            y: 1250,
            h: 180 * _DEG,
            // damage:15,
            ai: new EscortAutoPilot({
                mission: {
                    type: 'follow',
                    targetShipId: 1
                },
                destination: undefined,
                path: [],
            }, 15, true)
        }),
        makeDefaultShip({
            name: 'The Flying Goose',
            faction: 'grance',
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

    ],
    projectiles: [],
    effects: [],
    land: [
        {
            x: 1000,
            y: 1000,
            shape: [
                [TerrainType.PLAIN, TerrainType.SWAMP, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN],
                [TerrainType.PLAIN, TerrainType.SWAMP, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN],
                [TerrainType.PLAIN, TerrainType.SWAMP, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN],
                [TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN],
            ]
        },

    ],
    towns: [
    ]
}

export const aiTrial: InitialConditions = {
    gameState: initalState,
    mapHeight: 1800,
    mapWidth: 2400,
}