import { GAME_STATE_DEFAULTS, Scenario } from "..";
import { FollowerAutoPilot } from "../../ai/follower-ai";
import { HunterAi, MissonAi } from "../../ai/mission-ai";
import { GameState, TERRAIN_SQUARE_SIZE } from "../../game-state";
import { makeFrigateShip, makeSloopShip, } from "../../game-state/ship";
import { _DEG } from "typed-geometry";
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
            makeSloopShip({
                x: TERRA_FIRMA.x + TERRAIN_SQUARE_SIZE * 22,
                y: TERRA_FIRMA.y - TERRAIN_SQUARE_SIZE * 5,
                h: _DEG * 40,
                id: 2,
                damage: 0,
                sailLevelTarget: 0,
                sailLevel: 0,
                ai: new FollowerAutoPilot(1)
            }),
            makeSloopShip({
                x: TERRA_FIRMA.x + TERRAIN_SQUARE_SIZE * 28,
                y: TERRA_FIRMA.y - TERRAIN_SQUARE_SIZE * 4,
                h: _DEG * 180,
                id: 3,
                damage: 0,
                sailLevelTarget: 0,
                sailLevel: 0,
                ai: new MissonAi({
                    mission: { type: 'patrol' },
                    path: [
                        {
                            x: TERRA_FIRMA.x + TERRAIN_SQUARE_SIZE * 30,
                            y: TERRA_FIRMA.y - TERRAIN_SQUARE_SIZE * 10,
                        },
                        {
                            x: TERRA_FIRMA.x + TERRAIN_SQUARE_SIZE * 4,
                            y: TERRA_FIRMA.y - TERRAIN_SQUARE_SIZE * 4,
                        },
                    ]
                }),
            }),
            makeSloopShip({
                id: 10,
                x: TERRA_FIRMA.x + TERRAIN_SQUARE_SIZE * 23,
                y: TERRA_FIRMA.y + TERRAIN_SQUARE_SIZE * -10,
                h: _DEG * 10,
                faction: 'grance',
                ai: new HunterAi(1)
            }),
            makeSloopShip({
                id: 11,
                x: TERRA_FIRMA.x + TERRAIN_SQUARE_SIZE * 20,
                y: TERRA_FIRMA.y + TERRAIN_SQUARE_SIZE * -13,
                h: _DEG * 10,
                faction: 'grance',
                ai: new HunterAi(1)
            }),
            makeSloopShip({
                id: 12,
                x: TERRA_FIRMA.x + TERRAIN_SQUARE_SIZE * 26,
                y: TERRA_FIRMA.y + TERRAIN_SQUARE_SIZE * -13,
                h: _DEG * 20,
                faction: 'grance',
                ai: new HunterAi(1)
            }),
            makeFrigateShip({
                id: 13,
                x: 920,
                y: 400,
                h: 0,
                faction: 'grance',
                ai: new MissonAi({
                    mission: { type: 'patrol' },
                    path: [
                        { x: 44 * TERRAIN_SQUARE_SIZE, y: 600 },
                        {
                            x: TERRA_FIRMA.x + TERRAIN_SQUARE_SIZE * 25,
                            y: TERRA_FIRMA.y + TERRAIN_SQUARE_SIZE - 3,
                        },
                    ]
                }),
            }),
            makeSloopShip({
                id: 14,
                x: 820,
                y: 400,
                h: 0,
                faction: 'grance',
                ai: new FollowerAutoPilot(13),
            })
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
                text: "Yarr. That galleon was a fine catch. You be a pirate now."
            },
            {
                person: BARNEY,
                expression: 'ANGRY',
                text: "Too bad, ye brought that wrath of the governor down on my here haven..."
            },
            {
                person: BARNEY,
                text: "There are two squadrons o' gunships coming here - if you want to keep your half of the prize, get out there and sink 'em!"
            },
        ]
    },
    name: 'Campaign Level four (pirates)',
    checkForOutcome(game) {
        if (!game.ships.some(_ => _.faction === 'grance')) {
            return {
                success: true,
                message: 'You fought off the hunters!',
                nextScenarioId: 'campaignPiratesFive',
            }
        }
        return undefined
    },
})