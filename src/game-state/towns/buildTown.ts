import { Fort, Town } from "../model";
import { XY, translate } from "../../lib/geometry";

export const makeFort = (distanceFromTown: XY, townPosition: XY): Fort => ({
    aimDirection: 0,
    damage: 0,
    cannons: [
        {
            cooldown: 0,
            firing: false,
            position: -0.25
        },
        {
            cooldown: 0,
            firing: false,
            position: 0.25
        },
    ],
    ...translate(distanceFromTown, townPosition)
})

export const makeTown = (input: Partial<Town> & Pick<Town, 'name' | 'id' | 'x' | 'y' | 'forts'>): Town => ({
    defences: input.profile?.maxDefences || 50,
    garrison: input.profile?.maxGarrison || 25,
    profile: {
        maxDefences: 50,
        maxGarrison: 25
    },
    invasions: [],
    ...input
})