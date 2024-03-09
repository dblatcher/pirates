import { GAME_STATE_DEFAULTS, Scenario } from "..";
import { GameState, TERRAIN_SQUARE_SIZE } from "../../game-state";
import { makeFrigateShip,  } from "../../game-state/ship";
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
            makeFrigateShip({
                name: 'Player McPlayerFace',
                x: TERRA_FIRMA.x + TERRAIN_SQUARE_SIZE * 25,
                y: TERRA_FIRMA.y + TERRAIN_SQUARE_SIZE - 3,
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

export const campaignPiratesFour: Scenario = ({
    makeInitialState,
    intro: {
        pages: [
            {
                person: BARNEY,
                text: "Yarr. you be a pirate now."
            }
        ]
    },
    name: 'Campaign Level four (pirates)',
})