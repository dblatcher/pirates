import { AttackAutoPilot } from "../ai";
import { GameState, Ship } from "../game-state";
import { FactionId } from "../game-state/faction";
import { makeDefaultShip, makeFrigateShip } from "../game-state/ship";
import { Scenario, GAME_STATE_DEFAULTS } from "../initial-conditions";
import { _DEG } from "../lib/geometry";


let nextId = 2;

const addAttackShip = (x: number, y: number, h = 0, faction: FactionId = 'grance'): Ship => {
    nextId++
    return makeDefaultShip({
        faction,
        id: nextId,
        x,
        y,
        sailLevel: .5,
        h: h * _DEG,
        ai: new AttackAutoPilot({ mission: { type: 'patrol' }, path: [], }, nextId, false)
    })
}

const makeInitialState = (): GameState => {
    const initalState: GameState = {
        ...GAME_STATE_DEFAULTS,
        wind: {
            direction: _DEG * 90,
            force: 10,
        },
        ships: [
            makeFrigateShip({
                name: 'Player McPlayerFace',
                faction: 'grance',
                x: 1000,
                y: 300,
                h: _DEG * 0,
                id: 1,
                damage: 0,
                sailLevelTarget: 0,
                sailLevel: 0
            }),
            addAttackShip(900, 300),
            addAttackShip(1200, 300),
            addAttackShip(1300, 300),
            addAttackShip(1400, 350),
            addAttackShip(1600, 310),
            addAttackShip(1200, 200),
            addAttackShip(1300, 200),
            addAttackShip(1400, 250),
            addAttackShip(1600, 210),

            addAttackShip(1200, 500, 180, 'spaim'),
            addAttackShip(1000, 600, 180, 'spaim'),
            addAttackShip(1200, 600, 180, 'spaim'),
            addAttackShip(1400, 600, 180, 'spaim'),
            addAttackShip(1600, 600, 180, 'spaim'),
            addAttackShip(1800, 600, 180, 'spaim'),
            addAttackShip(1300, 750, 180, 'spaim'),
            addAttackShip(1000, 800, 180, 'spaim'),
            addAttackShip(1200, 800, 180, 'spaim'),
            addAttackShip(1400, 800, 180, 'spaim'),
            addAttackShip(1600, 800, 180, 'spaim'),
            addAttackShip(1800, 800, 180, 'spaim'),
            addAttackShip(1300, 750, 180, 'spaim'),
            addAttackShip(1650, 750, 180, 'spaim'),
            addAttackShip(1000, 900, 180, 'spaim'),
            addAttackShip(1200, 900, 180, 'spaim'),
            addAttackShip(1400, 900, 180, 'spaim'),
            addAttackShip(1600, 900, 180, 'spaim'),
            addAttackShip(1800, 900, 180, 'spaim'),


        ],
    }
    return initalState
}

export const bigMesseyBattle: Scenario = ({
    makeInitialState,
    mapHeight: 1800,
    mapWidth: 2400,
    name: 'Big Messy Battle',
})