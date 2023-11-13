import { ShipProfile, Ship } from "./types";
import { Side } from "../types";

const sloopProfile = (): ShipProfile => ({
    maxHp: 20,
    speed: 1,
    maneuver: 1
})

const defaultCannons = () => [
    { side: Side.LEFT, cooldown: 0 },
    { side: Side.RIGHT, cooldown: 0 },
]

const sloopAttributes = () => ({
    width: 20,
    length: 80,
    profile: sloopProfile(),
    cannons: defaultCannons(),
})

const shipDefaults = () => ({
    turnsUnimpeded: 0,
    speedLastTurn: 0,
    sailLevel: 0,
    wheel: 0,
    sailLevelTarget: 0,
    damage: 0,
})

export const makeSloopShip = (input: Pick<Ship, 'x' | 'y' | 'h' | 'id'> & Partial<Ship>): Ship => {

    return {
        ...shipDefaults(),
        ...sloopAttributes(),
        ...input,
    }
}

export const makeDefaultShip = makeSloopShip