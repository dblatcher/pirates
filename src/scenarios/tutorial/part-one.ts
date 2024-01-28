import { GAME_STATE_DEFAULTS, Scenario } from "..";
import { GameState } from "../../game-state";
import { inputToLandmass } from "../../game-state/land";
import { makeSloopShip } from "../../game-state/ship";
import { _DEG } from "../../lib/geometry";
import { tutorialPerson, tutorialLagoon } from "./library";


const makeInitialState = (): GameState => {
    const initalState: GameState = {
        ...GAME_STATE_DEFAULTS,
        wind: {
            direction: _DEG * 90,
            force: 10,
        },
        ships: [
            makeSloopShip({
                name: 'Player McPlayerFace',
                faction: 'grance',
                x: 200,
                y: 200,
                h: _DEG * 50,
                id: 1,
                damage: 0,
                sailLevelTarget: 0,
                sailLevel: 0
            }),

        ],
        land: tutorialLagoon.map(inputToLandmass),
    }
    return initalState
}

export const tutorialOne: Scenario = ({
    makeInitialState,
    mapHeight: 1000,
    mapWidth: 1000,
    name: 'Cadet School - lesson 1',
    intro: {
        pages: [
            { text: 'zzzzzzzz, hrrrmh zzzzz...', expression: 'ASLEEP', person: tutorialPerson },
            { text: 'hrrm, what!', expression: 'AFRAID', person: tutorialPerson },
            { text: 'Oh, you\'re the new sea cadet, here to learn how to captain a ship, are you?', expression: 'NEUTRAL', person: tutorialPerson },
            { text: 'First task - sail your ship to the south east corner of the lagoon.', expression: 'NEUTRAL', person: tutorialPerson },
        ]
    },
    checkForOutcome(game) {
        const player = game.ships.find(ship => ship.id === game.playerId)

        if (!player) { return undefined }

        if (player.x > 750 && player.y > 750) {
            return ({
                success: true,
                message: 'you made it.',
                nextScenarioId: 'tutorialOne',
            })
        }
        return undefined
    },
})