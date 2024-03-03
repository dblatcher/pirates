import { FollowerAutoPilot } from "../ai/follower-ai";
import { MissonAi } from "../ai/mission-ai";
import { TerrainType, inputToLandmass } from "../game-state/land";
import { GameState } from "../game-state/model";
import { makeDefaultShip, makeFrigateShip } from "../game-state/ship";
import { makeTown } from "../game-state/towns";
import { GAME_STATE_DEFAULTS, Scenario } from ".";
import { _DEG, xy } from "../lib/geometry";

const makeInitialState = (): GameState => {

    const initalState: GameState = {
        ...GAME_STATE_DEFAULTS,
        mapHeight: 1800,
        mapWidth: 2400,
        wind: {
            direction: _DEG * 90,
            force: 10,
        },
        ships: [
            makeFrigateShip({
                name: 'Player McPlayerFace',
                faction: 'grance',
                x: 1100,
                y: 450,
                h: _DEG * 270,
                id: 1,
                damage: 10,
                sailLevelTarget: 0,
                sailLevel: 0
            }),
            makeDefaultShip({
                name: 'follower one',
                faction: 'grance',
                id: 15,
                x: 1250,
                y: 350,
                h: 0 * _DEG,
                damage: 4,
                ai: new FollowerAutoPilot(1, true)
            }),
            makeDefaultShip({
                name: 'follower two',
                faction: 'grance',
                id: 16,
                x: 1350,
                y: 350,
                h: 0 * _DEG,
                damage: 3,
                ai: new FollowerAutoPilot(1, true)
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
                }, false)
            }),
            makeDefaultShip({
                id: 27,
                faction: 'grance',
                name: 'ship in square',
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
                }, true)
            }),
            makeFrigateShip({
                id: 3,
                name: 'The Dead Duck',
                x: 550,
                y: 650,
                h: _DEG * 0,
                damage: 0,
            }),
            makeDefaultShip({
                id: 4,
                name: 'The target',
                x: 1000,
                y: 1500,
                h: _DEG * 90,
                damage: 19,
            }),

        ],
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
        ].map(inputToLandmass),
        towns: [
            makeTown({
                x: 1200,
                y: 600,
                faction: 'spaim',
                name: 'Invade Me',
                id: 1,
                defences: 1,
                garrison: 20,
            }),
        ],
    }

    return initalState
}

export const aiTrial: Scenario = ({
    makeInitialState,
    name: 'AI Testing Scenario'
})