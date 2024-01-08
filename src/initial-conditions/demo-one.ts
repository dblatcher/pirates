import { AttackAutoPilot, PathFollowAutoPilot } from "../ai";
import { FollowerAutoPilot } from "../ai/follower-ai";
import { GameState } from "../game-state";
import { makeDefaultShip, makeFrigateShip } from "../game-state/ship";
import { GAME_STATE_DEFAULTS, Scenario } from "../initial-conditions";
import { _DEG } from "../lib/geometry";
import { demoLand, makeDemoTowns } from "./library";

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
                x: 300,
                y: 150,
                h: _DEG * 50,
                id: 1,
                damage: 0,
                sailLevelTarget: 0,
                sailLevel: 0
            }),
            makeDefaultShip({
                name: 'Wingman',
                faction: 'grance',
                id: 15,
                x: 1600,
                y: 1300,
                h: 0,
                // damage:15,
                ai: new FollowerAutoPilot(1, 15, false)
            }),
            makeDefaultShip({
                name: 'The Flying Goose',
                faction: 'spaim',
                x: 300,
                y: 0,
                h: Math.PI * .5,
                width: 15,
                length: 60,
                id: 2,
                ai: new PathFollowAutoPilot(
                    {
                        mission: {
                            type: 'travel',
                        },
                        destination: { x: 100, y: 500 },
                        path: []
                    }, 2, false),
            }),
            makeFrigateShip({
                id: 3,
                name: 'The Dead Duck',
                x: 1550,
                y: 300,
                h: Math.PI * 1.4,
                damage: 10,
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
                }, 14, false)
            }),
            makeDefaultShip({
                name: 'Spaim 1',
                id: 4,
                x: 700,
                y: 500,
                h: _DEG * 30,
                faction: 'spaim',
                ai: new AttackAutoPilot({
                    mission: { type: 'patrol' },
                    path: [],
                }, 4, false)
            }),
            makeDefaultShip({
                name: 'Grance 1',
                id: 5,
                x: 650,
                y: 500,
                h: _DEG * 30,
                damage: 10,
                faction: 'grance',
                ai: new AttackAutoPilot({
                    mission: { type: 'patrol' },
                    path: [],
                }, 5, false)
            }),
        ],
        land: demoLand,
        towns: makeDemoTowns(1),
    }
    return initalState
}

export const demoOne: Scenario = ({
    makeInitialState,
    mapHeight: 1800,
    mapWidth: 2400,
    name: 'Demo Scenario One',
    intro: {
        pages: [
            { text: 'This is a demo scenario. I will tell you what to do now, please pay attention.' },
            { text: 'The enemy has built a town nearby. Curse them!', expression: 'ANGRY' },
            { text: 'Your mission is to capture the enemy town. It is to the south. Check your map.', expression: 'HAPPY' },
        ]
    },
    checkForOutcome(game) {
        if (game.towns.every(_ => _.faction === 'grance')) {
            return {
                success: true,
                message: 'You captured the town.',
                nextScenarioId: 'demoTwo',
            }
        }
        return undefined
    },
})