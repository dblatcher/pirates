import { Flag, Side } from "../types";
import { Ship } from "./types";

const SMALL_PENNANT: Flag = {
    shape: 'triangle', length: 30, height: 10
}
// const BIG_PENNANT: Flag = {
//     shape: 'triangle', length: 40, height: 15
// }
const BIG_JACK: Flag = {
    shape: 'rectangle', length: 21, height: 15
}

const defaultCannons = () => [
    { side: Side.LEFT, cooldown: 0 },
    { side: Side.RIGHT, cooldown: 0 },
]

const shipDefaults = () => ({
    turnsUnimpeded: 0,
    speedLastTurn: 0,
    sailLevel: 0,
    wheel: 0,
    sailLevelTarget: 0,
    damage: 0,
})

const sloopAttributes = () => ({
    width: 20,
    length: 80,
    profile: {
        maxHp: 20,
        speed: 1,
        maneuver: 1,
        masts: [
            { position: -1 / 5, height: 1.5 },
            { position: 1 / 4, height: 1, flag: SMALL_PENNANT },
        ]
    },
    cannons: defaultCannons(),
})

const frigateAttributes = () => ({
    width: 25,
    length: 100,
    profile: {
        maxHp: 40,
        speed: .8,
        maneuver: .9,
        masts: [
            { position: -.4, height: 1 },
            { position: -.1, height: 1.8, flag: BIG_JACK },
            { position: .25, height: .8, flag: SMALL_PENNANT },
        ]
    },
    cannons: defaultCannons(),
})

export const makeFrigateShip = (input: Pick<Ship, 'x' | 'y' | 'h' | 'id'> & Partial<Ship>): Ship => ({
    ...shipDefaults(),
    ...frigateAttributes(),
    ...input,
})

export const makeSloopShip = (input: Pick<Ship, 'x' | 'y' | 'h' | 'id'> & Partial<Ship>): Ship => ({
    ...shipDefaults(),
    ...sloopAttributes(),
    ...input,
})

export const makeDefaultShip = makeSloopShip