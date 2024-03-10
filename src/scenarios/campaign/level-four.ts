import { GAME_STATE_DEFAULTS, Scenario } from "..";
import { GameState } from "../../game-state";
import { makeFrigateShip, } from "../../game-state/ship";
import { _DEG } from "../../lib/geometry";
import { MAP_HEIGHT, MAP_WIDTH, ROBERT, landMasses, makeTownCanto, makeTownHaven, makeTownLaGroupelle, makeTownTeulville } from "./library";

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

export const campaignFour: Scenario = ({
    makeInitialState,
    intro: {
        pages: [
            {
                person: ROBERT,
                text: "Keep capturing prizes like that an you'll be in for a promotion!",
                expression: 'HAPPY',
            },
            {
                person: ROBERT,
                expression: 'ODD',
                text: "This is the end of the campaign for now."
            },
        ]
    },
    name: 'Campaign Level four',
    checkForOutcome(game) {
        if (game.cycleNumber > 50) {
            return {
                success: true,
                exitToTitle: true,
                message: 'campaign over'
            }
        }
        return undefined
    },
})