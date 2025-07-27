import { GAME_STATE_DEFAULTS, Scenario } from "..";
import { AttackAutoPilot } from "../../ai";
import { MissonAi } from "../../ai/mission-ai";
import { GameState, TERRAIN_SQUARE_SIZE } from "../../game-state";
import { makeCargoBarge, makeDefaultShip, makeFrigateShip } from "../../game-state/ship";
import { _DEG, xy } from "typed-geometry";
import { MAP_HEIGHT, MAP_WIDTH, ROBERT, landMasses, makeTownLaGroupelle, makeTownTeulville } from "./library";

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
                x: 820,
                y: 400,
                h: _DEG * 90,
                id: 1,
                damage: 0,
                sailLevelTarget: 0,
                sailLevel: 0
            }),
            makeDefaultShip({
                name: 'Pierre',
                faction: 'grance',
                id: 2,
                x: 750,
                y: 500,
                h: _DEG * 90,
                ai: new AttackAutoPilot({
                    mission: {
                        type: 'patrol', waypoints: [
                        ]
                    },
                    path: [],
                })
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
                            xyT(19, 30),
                            xyT(20, 8),
                            xyT(30, 10)
                        ]
                    },
                    path: []
                }, true)
            }),
            makeCargoBarge({
                name: "Bart's barge",
                faction: 'grance',
                id: 4,
                ...xyT(19,30),
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
                },true)
            }),
            makeDefaultShip({
                name: 'Spaimish Patrol 1',
                id: 5,
                x: 700,
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
                })
            }),
            makeDefaultShip({
                name: 'Spaimish Patrol 2',
                id: 6,
                x: 1700,
                y: 500,
                h: _DEG * 30,
                faction: 'spaim',
                ai: new AttackAutoPilot({
                    mission: { type: 'patrol' },
                    path: [],
                })
            }),
            makeDefaultShip({
                name: 'Spaimish Patrol 3',
                id: 7,
                ...xyT(30, 20),
                h: _DEG * 30,
                faction: 'spaim',
                ai: new AttackAutoPilot({
                    mission: { type: 'patrol' },
                    path: [
                        xyT(18,20),
                        xyT(20,15),
                        xyT(30,20),
                    ],
                })
            }),
        ],
        land: landMasses,
        towns: [
            makeTownLaGroupelle(),
            makeTownTeulville(),
        ],
    }
    return initalState
}

export const campaignLevelOne: Scenario = ({
    makeInitialState,
    name: 'Campaign',
    intro: {
        pages: [
            { text: 'Welcome to the colonies, captain.', person: ROBERT },
            { text: 'You may have expected an easy time of it here, but I have work for you.', person: ROBERT, expression:'SUSPICIOUS' },
            { text: 'There are three enemy ships lurking in these waters, menacing the local merchants.', person: ROBERT, expression:'ANGRY'},
            { text: 'Your mission is to sink the enemy ships.', person: ROBERT, },
            { text: 'A word of advice - if you get badly damaged, head back here to port for repairs before going after the rest of them.', person: ROBERT},
            { text: 'If you lure them in range of our forts, all the better.', person: ROBERT, expression:'HAPPY'},
        ]
    },
    checkForOutcome(game) {
        if (!game.ships.some(_ => _.faction === 'spaim')) {
            return {
                success: true,
                message: 'You sank all the Spaimish ships.',
                nextScenarioId: 'campaignLevelTwo',
            }
        }
        return undefined
    },
})