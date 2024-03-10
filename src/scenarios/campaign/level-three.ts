import { GAME_STATE_DEFAULTS, Scenario } from "..";
import { AttackAutoPilot } from "../../ai";
import { FollowerAutoPilot } from "../../ai/follower-ai";
import { MissonAi } from "../../ai/mission-ai";
import { GameState, TERRAIN_SQUARE_SIZE } from "../../game-state";
import { makeDefaultShip, makeFrigateShip, makeGalleonShip } from "../../game-state/ship";
import { _DEG, getDistance } from "../../lib/geometry";
import { MAP_HEIGHT, MAP_WIDTH, ROBERT, landMasses, makeTownCanto, makeTownHaven, makeTownLaGroupelle, makeTownTeulville, townIds } from "./library";

const galleonId = 2

const galleonWaypoints = [
    {
        x: TERRAIN_SQUARE_SIZE * 15,
        y: TERRAIN_SQUARE_SIZE * 20,
    },
    {
        x: TERRAIN_SQUARE_SIZE * 25,
        y: TERRAIN_SQUARE_SIZE * 20,
    },
    {
        x: TERRAIN_SQUARE_SIZE * 38,
        y: TERRAIN_SQUARE_SIZE * 10,
    },
    {
        x: MAP_WIDTH - 1,
        y: TERRAIN_SQUARE_SIZE * 10,
    },
    {
        x: MAP_WIDTH + TERRAIN_SQUARE_SIZE * 40,
        y: TERRAIN_SQUARE_SIZE * 10,
    },
]

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
            makeGalleonShip({
                name: 'The Silver Train',
                faction: 'spaim',
                x: TERRAIN_SQUARE_SIZE * 8,
                y: TERRAIN_SQUARE_SIZE * 16,
                h: _DEG * 90,
                id: galleonId,
                ai: new MissonAi({
                    mission: {
                        type: 'travel',
                        waypointIndex: 0,
                        waypoints: galleonWaypoints
                    },
                    path: [],
                }, true)
            },),

            makeDefaultShip({
                name: 'Watchdog',
                faction: 'spaim',
                id: 3,
                x: TERRAIN_SQUARE_SIZE * 6,
                y: TERRAIN_SQUARE_SIZE * 18,
                h: _DEG * 90,
                ai: new FollowerAutoPilot(galleonId, false)
            }),
            makeDefaultShip({
                name: 'Sentry',
                faction: 'spaim',
                id: 4,
                x: TERRAIN_SQUARE_SIZE * 13,
                y: TERRAIN_SQUARE_SIZE * 18,
                h: _DEG * 90,
                ai: new FollowerAutoPilot(galleonId, false)
            }),
            makeDefaultShip({
                name: 'Spaimish Patrol',
                id: 14,
                x: 600,
                y: 1100,
                h: _DEG * 30,
                faction: 'spaim',
                ai: new AttackAutoPilot({
                    mission: {
                        type: 'patrol', waypoints: [
                            { x: 700, y: 1100 },
                            { x: 700, y: 650 },
                            { x: 400, y: 600 },
                            { x: 400, y: 1000 },
                        ]
                    },
                    path: [],
                })
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

export const campaignLevelThree: Scenario = ({
    makeInitialState,
    name: 'Campaign - level Three',
    intro: {
        pages: [
            { text: "It was all a decoy - they've stolen my treasure galleon!", person: ROBERT, expression:'AFRAID' },
            { text: 'Capture that galleon before it ecapes to the east.', person: ROBERT, },
            { text: 'Bring it back to La Groupelle.', person: ROBERT, },
            { text: "Don't event think about taking it to Pirates' Haven and keeping the treasure for yourself...", person: ROBERT, expression: 'ANGRY' },
            { text: "Unless you want to be hunted down as a filthy, thieving pirate, that is.", person: ROBERT, expression: 'ANGRY' },
        ]
    },
    checkForOutcome(game) {
        const galleon = game.ships.find(ship => ship.id === galleonId)
        const groupelle = game.towns.find(town => town.id === townIds.GROUPELLE)
        const haven = game.towns.find(town => town.id === townIds.HAVEN)

        if (!galleon) {
            return {
                success: false,
                message: 'The galleon was sunk away!'
            }
        }

        if (galleon?.faction === 'spaim' && galleon.x > TERRAIN_SQUARE_SIZE * 42) {
            return {
                success: false,
                message: 'The galleon got away!'
            }
        }
        if (groupelle && galleon?.faction === 'grance' && getDistance(galleon, groupelle) < 550) {
            return {
                success: true,
                message: 'You brought back the galleon.',
                nextScenarioId: 'campaignFour',
            }
        }
        if (haven && galleon?.faction === 'grance' && getDistance(galleon, haven) < 250) {
            return {
                success: true,
                message: 'You stole the galleon and joined the pirates!.',
                nextScenarioId: 'campaignPiratesFour'
            }
        }

        return undefined
    },
})