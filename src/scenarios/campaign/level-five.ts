import { GAME_STATE_DEFAULTS, Scenario } from "..";
import { AttackAutoPilot } from "../../ai";
import { MissonAi } from "../../ai/mission-ai";
import { GameState, TERRAIN_SQUARE_SIZE } from "../../game-state";
import { factions } from "../../game-state/faction";
import { makeCargoBarge, makeFrigateShip, makeSloopShip, } from "../../game-state/ship";
import { rgb } from "../../lib/Color";
import { _DEG, xy } from "../../lib/geometry";
import { MAP_HEIGHT, MAP_WIDTH, ROBERT, landMasses, makeTownCanto, makeTownForto, makeTownHaven, makeTownLaGroupelle, makeTownTeulville } from "./library";

const xyT = (x: number, y: number) => xy(x * TERRAIN_SQUARE_SIZE, y * TERRAIN_SQUARE_SIZE)

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
            makeCargoBarge({
                name: 'Cargio',
                faction: 'grance',
                id: 3,
                ...xyT(12, 11),
                h: _DEG * 90,
                ai: new MissonAi({
                    mission: {
                        type: 'travel', waypoints: [
                            xyT(20, 31),
                            xyT(21, 9),
                            xyT(31, 11)
                        ]
                    },
                    path: []
                }, true)
            }),
            makeCargoBarge({
                name: "Bart's barge",
                faction: 'grance',
                id: 4,
                ...xyT(19, 30),
                h: _DEG * 90,
                ai: new MissonAi({
                    mission: {
                        type: 'travel', waypoints: [
                            xyT(19, 30),
                            xyT(20, 8),
                            xyT(30, 10)
                        ]
                    },
                    path: []
                }, true)
            }),

            makeSloopShip({
                h: 0,
                x: TERRAIN_SQUARE_SIZE * 32,
                y: TERRAIN_SQUARE_SIZE * 10,
                id: 5,
                ai: new AttackAutoPilot(),
            }),
            makeSloopShip({
                h: 0,
                x: TERRAIN_SQUARE_SIZE * 32,
                y: TERRAIN_SQUARE_SIZE * 14,
                id: 6,
                ai: new AttackAutoPilot(),
            }),
        ],
        land: landMasses,
        towns: [
            makeTownLaGroupelle(),
            makeTownCanto('grance'),
            makeTownTeulville(),
            makeTownHaven(),
            makeTownForto('grance'),
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

export const campaignFive: Scenario = ({
    makeInitialState,
    intro: {
        pages: [
            {
                person: ROBERT,
                text: "Well done Captain! This bay is ours now! But there's no time to rest on your laurels.",
                expression: 'HAPPY',
            },
            {
                person: ROBERT,
                text: "Now this area is under control, You are being re-assiged. Collect supplies from Villa della Canto to prepare for the journey."
            },
            {
                person: ROBERT,
                expression: 'HAPPY',
                text: "When you have them, and head east out the bay, then sail to the Windswept Isles. Good luck in your new posting!"
            },
        ]
    },
    name: 'Campaign Level five',
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
})