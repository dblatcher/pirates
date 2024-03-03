import { GAME_STATE_DEFAULTS, Scenario } from "..";
import { MissonAi } from "../../ai/mission-ai";
import { GameState, TERRAIN_SQUARE_SIZE } from "../../game-state";
import { makeFrigateShip, makeGalleonShip } from "../../game-state/ship";
import { _DEG } from "../../lib/geometry";
import { MAP_HEIGHT, MAP_WIDTH, landMasses } from "./library";

const makeInitialState = (): GameState => {
    const initalState: GameState = {
        ...GAME_STATE_DEFAULTS,
        mapHeight: MAP_HEIGHT,
        mapWidth: MAP_WIDTH,
        wind: {
            direction: _DEG * 90,
            force: 10,
        },
        ships: [
            makeFrigateShip({
                name: 'Player McPlayerFace',
                faction: 'grance',
                x: TERRAIN_SQUARE_SIZE * 8,
                y: TERRAIN_SQUARE_SIZE * 12,
                h: _DEG * 50,
                id: 1,
                damage: 0,
                sailLevelTarget: 0,
                sailLevel: 0
            }),

            makeGalleonShip({
                name: 'The Silver Train',
                faction: 'spaim',
                x: TERRAIN_SQUARE_SIZE * 8,
                y: TERRAIN_SQUARE_SIZE * 16,
                h: _DEG * 90,
                id: 2,
                ai: new MissonAi({
                    mission: {
                        type: 'travel',
                        waypointIndex: 0,
                        waypoints: [
                            {
                                x: TERRAIN_SQUARE_SIZE * 15,
                                y: TERRAIN_SQUARE_SIZE * 20,
                            },
                            {
                                x: TERRAIN_SQUARE_SIZE * 25,
                                y: TERRAIN_SQUARE_SIZE * 20,
                            },
                            {
                                x: TERRAIN_SQUARE_SIZE * 38,
                                y: TERRAIN_SQUARE_SIZE * 10,
                            },
                            {
                                x: MAP_WIDTH - 1,
                                y: TERRAIN_SQUARE_SIZE * 10,
                            },
                        ]
                    },
                    path: [],
                }, true)
            },)
        ],
        land: landMasses,
        towns: [
        ],
    }
    return initalState
}

export const campaignMapTest: Scenario = ({
    makeInitialState,
    name: 'Campaign Map Test',
})