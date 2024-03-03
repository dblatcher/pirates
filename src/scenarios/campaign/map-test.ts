import { GAME_STATE_DEFAULTS, Scenario } from "..";
import { GameState } from "../../game-state";
import { makeFrigateShip } from "../../game-state/ship";
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
                x: 997,
                y: 666,
                h: _DEG * 50,
                id: 1,
                damage: 0,
                sailLevelTarget: 0,
                sailLevel: 0
            }),

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