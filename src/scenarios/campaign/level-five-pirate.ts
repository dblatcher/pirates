import { GAME_STATE_DEFAULTS, Scenario } from "..";
import { FollowerAutoPilot } from "../../ai/follower-ai";
import { MissonAi } from "../../ai/mission-ai";
import { GameState, TERRAIN_SQUARE_SIZE } from "../../game-state";
import { makeFrigateShip, makePinnaceShip, makeSloopShip, } from "../../game-state/ship";
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
                text: "Yar-harr! That was a fine battle!"
            },
            {
                person: BARNEY,
                expression: 'HAPPY',
                text: "Ye have the makin's of a fine buccaneer!"
            },
            {
                person: BARNEY,
                expression: 'NEUTRAL',
                text: "There be richer rewards in store out there. 'Tis time ye travelled to new seas."
            },
            {
                person: BARNEY,
                expression: 'NEUTRAL',
                text: "Take this pinnace and head east out the bay, then sail to the Windswept Isles."
            },
        ]
    },
    name: 'Campaign Level five (pirates)',
    checkForOutcome({ ships, playerId }) {

        const player = ships.find(_ => _.id === playerId)

        if (player && player.x > MAP_WIDTH) {
            return {
                success: true,
                message: 'Campaign Complete!',
                exitToTitle: true,
            }
        }

        return undefined
    },
})