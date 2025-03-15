import { GAME_STATE_DEFAULTS, Scenario } from "..";
import { FollowerAutoPilot } from "../../ai/follower-ai";
import { MissonAi } from "../../ai/mission-ai";
import { GameState, TERRAIN_SQUARE_SIZE } from "../../game-state";
import { factions } from "../../game-state/faction";
import { makeFrigateShip, makePinnaceShip, makeSloopShip, } from "../../game-state/ship";
import { rgb } from "../../lib/Color";
import { _DEG } from "../../lib/geometry";
import { BARNEY, MAP_HEIGHT, MAP_WIDTH, TERRA_FIRMA, landMasses, makeTownCanto, makeTownHaven, makeTownLaGroupelle, makeTownTeulville } from "./library";

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
            makePinnaceShip({
                name: 'Speedy McReady',
                x: TERRA_FIRMA.x + TERRAIN_SQUARE_SIZE * 25,
                y: TERRA_FIRMA.y + TERRAIN_SQUARE_SIZE - 3,
                h: _DEG * 50,
                id: 1,
                damage: 0,
                sailLevelTarget: 0,
                sailLevel: 0
            }),
            makeFrigateShip({
                x: TERRA_FIRMA.x + TERRAIN_SQUARE_SIZE * 18,
                y: TERRA_FIRMA.y - TERRAIN_SQUARE_SIZE * 4,
                h: _DEG * 180,
                id: 3,
                damage: 0,
                sailLevelTarget: 0,
                sailLevel: 0,
                ai: new MissonAi({
                    mission: { type: 'patrol' },
                    path: [
                    ]
                }),
            }),
            makeSloopShip({
                id: 14,
                x: 1820,
                y: 600,
                h: 0,
                faction: 'grance',
                ai: new MissonAi({
                    mission: {
                        type: 'patrol',
                    },
                    path: [
                        {
                            x: 2020,
                            y: 300,
                        },
                        {
                            x: 2020,
                            y: 1400,
                        },
                    ]
                })
            }),
            makeSloopShip({
                id: 15,
                x: 1820,
                y: 500,
                h: 0,
                faction: 'grance',
                ai: new FollowerAutoPilot(14)
            }),

        ],
        land: landMasses,
        towns: [
            makeTownLaGroupelle(),
            makeTownCanto('grance'),
            makeTownTeulville(),
            makeTownHaven(),
        ],
        objectives: [
            {
                name: "rum",
                x: TERRAIN_SQUARE_SIZE * 23,
                y: TERRAIN_SQUARE_SIZE * 27,
                flag: {
                    length: 20,
                    height: 15,
                    shape: 'triangle'
                },
                flagColorOne: rgb(factions.grance.color),
            },
            {
                name: "hard tack",
                x: TERRAIN_SQUARE_SIZE * 18,
                y: TERRAIN_SQUARE_SIZE * 30,
                flag: {
                    length: 20,
                    height: 15,
                    shape: 'triangle'
                },
                flagColorOne: rgb(factions.grance.color),
            },
        ]
    }
    return initalState
}

export const campaignPiratesFive: Scenario = ({
    makeInitialState,
    intro: {
        pages: [
            {
                person: BARNEY,
                expression: 'HAPPY',
                text: "Yar-harr! That was a fine battle! Ye have the makin's of a fine buccaneer!"
            },
            {
                person: BARNEY,
                expression: 'HAPPY',
                text: "There be richer rewards in store out for ye... 'Tis time ye travelled to new seas."
            },
            {
                person: BARNEY,
                expression: 'NEUTRAL',
                text: "Arrr, but don't be forgetting to steal some supplies from that town to the west first!"
            },
            {
                person: BARNEY,
                expression: 'NEUTRAL',
                text: "Take this pinnace, grab the supplies, head east out the bay, then sail to the Windswept Isles!"
            },
        ]
    },
    name: 'Campaign Level five (pirates)',
    checkForOutcome({ ships, playerId, objectives }) {
        const player = ships.find(_ => _.id === playerId)
        if (player && player.x > MAP_WIDTH) {
            if (objectives.some(objective => !objective.obtained)) {
                return {
                    success: false,
                    message: 'You left without your supplies!',
                }
            }
            return {
                success: true,
                message: 'Campaign Complete!',
                exitToTitle: true,
            }
        }

        return undefined
    },
    getShareMessage({ success }) {
        if (success) {
            return {
                postText: "I sailed off to join the pirates on #Buccaneer!"
            }
        }
        return undefined
    },
})