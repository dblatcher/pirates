import { GAME_STATE_DEFAULTS, Scenario } from "..";
import { GameState } from "../../game-state";
import { inputToLandmass } from "../../game-state/land";
import { makeFrigateShip, makeSloopShip } from "../../game-state/ship";
import { _DEG } from "typed-geometry";
import { makeTownOne, tutorialLagoon, tutorialPerson } from "./library";


const makeInitialState = (): GameState => {
    const initalState: GameState = {
        mapHeight: 1000,
        mapWidth: 1000,
        ...GAME_STATE_DEFAULTS,
        wind: {
            direction: _DEG * 90,
            force: 10,
        },
        ships: [
            makeFrigateShip({
                name: 'Player McPlayerFace',
                faction: 'grance',
                x: 800,
                y: 850,
                h: _DEG * 190,
                id: 1,
                damage: 0,

            }),

            makeSloopShip({
                name: 'Dead Duck',
                x: 550, y: 400,
                h: _DEG * 45,
                id: 2
            })

        ],
        land: tutorialLagoon.map(inputToLandmass),
        towns: [makeTownOne()]
    }
    return initalState
}


export const tutorialTwo: Scenario = ({
    makeInitialState,
    name: 'Cadet School - lesson 2',
    intro: {
        pages: [
            { text: 'zzzzzzzz, hrrrmh zzzzz...', expression: 'ASLEEP', person: tutorialPerson },
            { text: 'Back already?', expression: 'AFRAID', person: tutorialPerson },
            { text: 'Very, well. Time to learn about gunnery. For the next lession, your task is to sink the empy ship in the middle of the lagoon.', person: tutorialPerson },
            { text: 'No, it won\'t shoot back...', person: tutorialPerson, expression: 'ANGRY' },
            { text: `You'll be sailng a frigate this time. It has more guns, but isn't as fast as the sloop.`, person: tutorialPerson },
            { text: `The 'q' and 'e' keys fire your cannons. Try changing the firing pattern with '1','2' and '3' too.`, person: tutorialPerson },
        ]
    },
    checkForOutcome(game) {
        const player = game.ships.find(ship => ship.id === game.playerId)

        if (!player) { return undefined }

        if (!game.ships.some(ship => ship.id === 2)) {
            return ({
                success: true,
                message: `You sunk the ship.`,
                nextScenarioId: 'tutorialThree',
            })
        }
        return undefined
    },
})