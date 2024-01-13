import { GAME_STATE_DEFAULTS, Scenario } from ".";
import { MissonAi } from "../ai/mission-ai";
import { GameState } from "../game-state/model";
import { makeDefaultShip } from "../game-state/ship";
import { _DEG } from "../lib/geometry";

const makeInitialState = (): GameState => {

    const initalState: GameState = {
        ...GAME_STATE_DEFAULTS,
        wind: {
            direction: _DEG * 90,
            force: 10,
        },
        ships: [
            makeDefaultShip({
                x: 550, y: 300, h: _DEG * 90, id: 2, faction: 'grance'
            }),
            makeDefaultShip({
                x: 550, y: 350, h: _DEG * 90, id: 3, faction: 'spaim'
            }),
            makeDefaultShip({
                x: 550, y: 400, h: _DEG * 90, id: 4, faction: 'spaim',
                ai: new MissonAi({
                    mission: {
                        type: 'travel',
                    },
                    path: [],
                }, 4, true)
            }),
            makeDefaultShip({
                x: 750, y: 300, h: _DEG * 90, id: 5, faction: 'grance'
            }),
            makeDefaultShip({
                x: 750, y: 350, h: _DEG * 90, id: 6, faction: 'spaim'
            }),
            makeDefaultShip({
                x: 750, y: 500, h: _DEG * 90, id: 7, faction: 'spaim',
                ai: new MissonAi({
                    mission: {
                        type: 'travel',
                    },
                    path: [],
                }, 7, true)
            }),
        ],
        land: [

        ],
        towns: [

        ],
    }

    return initalState
}

export const sandbox: Scenario = ({
    makeInitialState,
    mapHeight: 1800,
    mapWidth: 2400,
    name: 'Logic checking sandbox'
})