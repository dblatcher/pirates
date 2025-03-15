import { GAME_STATE_DEFAULTS, Scenario } from "..";
import { AttackAutoPilot } from "../../ai";
import { FollowerAutoPilot } from "../../ai/follower-ai";
import { GameState, TERRAIN_SQUARE_SIZE } from "../../game-state";
import { makeFrigateShip, makeSloopShip, } from "../../game-state/ship";
import { _DEG } from "../../lib/geometry";
import { MAP_HEIGHT, MAP_WIDTH, ROBERT, landMasses, makeTownCanto, makeTownForto, makeTownHaven, makeTownLaGroupelle, makeTownTeulville } from "./library";

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
            makeFrigateShip({
                name: 'La Retribution',
                faction: 'grance',
                x: 400,
                y: 600,
                h: _DEG * 50,
                id: 2,
                damage: 0,
                sailLevelTarget: 0,
                sailLevel: 0,
                ai: new FollowerAutoPilot(1)
            }),

            makeSloopShip({
                faction: 'spaim',
                h: 0,
                x: TERRAIN_SQUARE_SIZE * 32,
                y: TERRAIN_SQUARE_SIZE * 10,
                id: 5,
                ai: new AttackAutoPilot(),
            }),
            makeSloopShip({
                faction: 'spaim',
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
            makeTownForto(),
        ],
    }
    return initalState
}

export const campaignFour: Scenario = ({
    makeInitialState,
    intro: {
        pages: [
            {
                person: ROBERT,
                text: "Keep capturing prizes like that and you'll be in for a promotion!",
                expression: 'HAPPY',
            },
            {
                person: ROBERT,
                text: "I have one more task for you, Captain. The enemy have established a fort on the north shore of the bay."
            },
            {
                person: ROBERT,
                text: "You must capture it to secure our position here. I've assigned another frigate to accompany you."
            },
        ]
    },
    name: 'Campaign Level four',
    checkForOutcome(game) {
        if (game.cycleNumber > 50) {
            if (!game.towns.some(_ => _.faction === 'spaim')) {
                return {
                    success: true,
                    message: 'You captured the town.',
                    nextScenarioId: 'campaignLevelFive',
                }
            }
        }
        return undefined
    },
})