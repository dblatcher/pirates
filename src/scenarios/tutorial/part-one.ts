import { GAME_STATE_DEFAULTS, Scenario } from "..";
import { GameState, TOWN_SIZE } from "../../game-state";
import { inputToLandmass } from "../../game-state/land";
import { makeSloopShip } from "../../game-state/ship";
import { _DEG, getDistance } from "../../lib/geometry";
import { tutorialPerson, tutorialLagoon, makeTownOne } from "./library";


const makeInitialState = (): GameState => {
    const initalState: GameState = {
        ...GAME_STATE_DEFAULTS,
        mapHeight: 1000,
        mapWidth: 1000,
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
        towns: [makeTownOne()]
    }
    return initalState
}

const townOneStatic = makeTownOne()

export const tutorialOne: Scenario = ({
    makeInitialState,
    name: 'Cadet School - lesson 1',
    intro: {
        pages: [
            { text: 'zzzzzzzz, hrrrmh zzzzz...', expression: 'ASLEEP', person: tutorialPerson },
            { text: 'hrrm, what!', expression: 'AFRAID', person: tutorialPerson },
            { text: 'Oh, you\'re the new sea cadet, here to learn how to captain a ship, are you?', person: tutorialPerson },
            { text: `First task - sail your ship to ${townOneStatic.name} in the south east corner of the lagoon.`, person: tutorialPerson },
            { text: `You can use the 'w' and 's' keys to raise and lower your sails and 'a' and 'd' to turn the wheel...`, person: tutorialPerson },
            { text: `Or use the on-screen controls for more precision.`, person: tutorialPerson },
        ]
    },
    checkForOutcome(game) {
        const player = game.ships.find(ship => ship.id === game.playerId)
        const targetTown = game.towns.find(town => town.id === townOneStatic.id)

        if (!player || !targetTown) { return undefined }

        if (getDistance(player, targetTown) < 100 + TOWN_SIZE) {
            return ({
                success: true,
                message: `You made it to ${townOneStatic.name}.`,
                nextScenarioId: 'tutorialTwo',
            })
        }
        return undefined
    },
})