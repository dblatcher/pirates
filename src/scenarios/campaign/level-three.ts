import { GAME_STATE_DEFAULTS, Scenario } from "..";
import { MissonAi } from "../../ai/mission-ai";
import { GameState, TERRAIN_SQUARE_SIZE } from "../../game-state";
import { makeFrigateShip, makeGalleonShip } from "../../game-state/ship";
import { _DEG, getDistance } from "../../lib/geometry";
import { MAP_HEIGHT, MAP_WIDTH, ROBERT, landMasses, makeTownCanto, makeTownLaGroupelle, makeTownTeulville } from "./library";

const galleonId = 2

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
                x: 400,
                y: 500,
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
                id: galleonId,
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
            makeTownLaGroupelle(),
            makeTownCanto('grance'),
            makeTownTeulville(),
        ],
    }
    return initalState
}

export const campaignLevelThree: Scenario = ({
    makeInitialState,
    name: 'Campaign - level Three',
    intro: {
        pages: [
            { text: 'Capture the galleon before it ecapes to the east.', person: ROBERT, },
            { text: 'Bring it back to La Groupelle.', person: ROBERT, },
        ]
    },
    checkForOutcome(game) {
        const galleon = game.ships.find(ship => ship.id === galleonId)
        const targetTown = game.towns.find(town => town.id === 1)

        if (galleon?.faction === 'spaim' && galleon.x > TERRAIN_SQUARE_SIZE * 42) {
            return {
                success: false,
                message: 'The galleon got away!'
            }
        }
        if (targetTown && galleon?.faction === 'grance' && getDistance(galleon, targetTown) < 500) {
            return {
                success: true,
                message: 'You brought back the galleon.'
            }
        }

        return undefined
    },
})