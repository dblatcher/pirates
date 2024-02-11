import { GAME_STATE_DEFAULTS, Scenario } from "..";
import { GameState } from "../../game-state";
import { inputToLandmass } from "../../game-state/land";
import { makeFrigateShip, makeSloopShip } from "../../game-state/ship";
import { _DEG } from "../../lib/geometry";
import { makePirateCamp, makeTownOne, tutorialLagoon, tutorialPerson } from "./library";


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
        ],
        land: tutorialLagoon.map(inputToLandmass),
        towns: [makeTownOne(), makePirateCamp()]
    }
    return initalState
}


export const tutorialThree: Scenario = ({
    makeInitialState,
    name: 'Cadet School - lesson 3',
    intro: {
        pages: [
            { text: 'Next lesson - how to invade enemy towns.', expression: 'NEUTRAL', person: tutorialPerson },
            { text: "You can send your marines to invade by sailing close enough to the town and pressing 'space', but there's more to it than that!", expression: 'NEUTRAL', person: tutorialPerson },
            { text: "Before they can land, you must bombard the town with your cannons to take down thier defences. But the town will be repairing them all the time.", expression: 'NEUTRAL', person: tutorialPerson },
            { text: "You also need to have enougth marines to defeat the garrison.", expression: 'NEUTRAL', person: tutorialPerson },
            { text: "Try it out on the pirate camp in the middle of the lagoon.", expression: 'NEUTRAL', person: tutorialPerson },
        ]
    },
    checkForOutcome(game) {
        const player = game.ships.find(ship => ship.id === game.playerId)

        if (!player) { return undefined }

        if (!game.towns.some(town => town.faction !== player.faction)) {
            return ({
                success: true,
                message: `You took the town!`,
                nextScenarioId: 'tutorialOne',
            })
        }
        return undefined
    },
})