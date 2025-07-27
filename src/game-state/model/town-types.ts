import { XY } from "typed-geometry"
import { FactionId } from "../faction"
import { FortCannon } from "./cannon-types"

export type Fort = XY & {
    h: number,
    cannons: FortCannon[],
    damage: number,
}

export type TownProfile = {
    maxDefences: number
    maxGarrison: number
}

export type Town = XY & {
    faction?: FactionId
    name: string,
    id: number,
    defences: number,
    profile: TownProfile,
    garrison: number,
    forts: Fort[],
}