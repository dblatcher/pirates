import { Flag, ShipCannon, Side } from "../model";
import { Ship } from "../model";

const SMALL_PENNANT: Flag = {
    shape: 'triangle', length: 30, height: 10
}
const TINY_PENNANT: Flag = {
    shape: 'triangle', length: 20, height: 8
}
// const BIG_PENNANT: Flag = {
//     shape: 'triangle', length: 40, height: 15
// }
const BIG_JACK: Flag = {
    shape: 'rectangle', length: 21, height: 15
}

const positionsToCannons = (positions: number[]) => positions.flatMap((position): ShipCannon[] => [
    { side: Side.LEFT, cooldown: 0, position, firing: false },
    { side: Side.RIGHT, cooldown: 0, position, firing: false },
])

const defaultCannons = () => positionsToCannons([.25, 0, -.25])
const frigateCannons = () => positionsToCannons([.45, .3, .15, 0, -.15, -.3, -.45])

const shipDefaults = () => ({
    turnsUnimpeded: 0,
    speedLastTurn: 0,
    sailLevel: 0,
    wheel: 0,
    sailLevelTarget: 0,
    damage: 0,
    marines: 10,
})

const cargoBargeAttributes = () => ({
    width: 25,
    length: 60,
    profile: {
        maxHp: 15,
        maxMarines: 5,
        speed: 1,
        maneuver: 1,
        masts: [
            { position: -1 / 4, height: .8, flag: SMALL_PENNANT },
        ]
    },
    cannons: [],
})

const pinnaceAttributes = () => ({
    width: 15,
    length: 65,
    profile: {
        maxHp: 15,
        maxMarines: 10,
        speed: 1.2,
        maneuver: 1.2,
        masts: [
            { position: -1 / 4, height: .8, flag: SMALL_PENNANT },
            { position: 1 / 3, height: .6, flag: TINY_PENNANT },
        ]
    },
    cannons: defaultCannons(),
})

const sloopAttributes = () => ({
    width: 20,
    length: 80,
    profile: {
        maxHp: 20,
        maxMarines: 20,
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
        maxMarines: 30,
        speed: .8,
        maneuver: .9,
        masts: [
            { position: -.4, height: 1 },
            { position: -.1, height: 1.8, flag: BIG_JACK },
            { position: .25, height: .8, flag: SMALL_PENNANT },
        ]
    },
    marines: 30,
    cannons: frigateCannons(),
})

const galleonAttributes = () => ({
    width: 30,
    length: 150,
    profile: {
        maxHp: 60,
        maxMarines: 20,
        speed: .5,
        maneuver: .6,
        masts: [
            { position: -.4, height: 1 },
            { position: -.2, height: 2, flag: BIG_JACK },
            { position: .15, height: 2, },
            { position: .3, height: .8, flag: SMALL_PENNANT },
        ]
    },
    marines: 30,
    cannons: frigateCannons(),
})


export const makeFrigateShip = (input: Pick<Ship, 'x' | 'y' | 'h' | 'id'> & Partial<Ship>): Ship => ({
    ...shipDefaults(),
    ...frigateAttributes(),
    ...input,
})

export const makePinnaceShip = (input: Pick<Ship, 'x' | 'y' | 'h' | 'id'> & Partial<Ship>): Ship => ({
    ...shipDefaults(),
    ...pinnaceAttributes(),
    ...input,
})

export const makeSloopShip = (input: Pick<Ship, 'x' | 'y' | 'h' | 'id'> & Partial<Ship>): Ship => ({
    ...shipDefaults(),
    ...sloopAttributes(),
    ...input,
})

export const makeCargoBarge = (input: Pick<Ship, 'x' | 'y' | 'h' | 'id'> & Partial<Ship>): Ship => ({
    ...shipDefaults(),
    ...cargoBargeAttributes(),
    ...input,
})

export const makeGalleonShip = (input: Pick<Ship, 'x' | 'y' | 'h' | 'id'> & Partial<Ship>): Ship => ({
    ...shipDefaults(),
    ...galleonAttributes(),
    ...input,
})



export const makeDefaultShip = makeSloopShip