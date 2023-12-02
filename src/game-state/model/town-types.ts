import { FortCannon } from "./cannon-types"
import { XY } from "../../lib/geometry"
import { FactionId } from "../faction"

export type Fort = XY & {
    aimDirection: number,
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
    invasions: InvasionByShip[],
    garrison: number,
    forts: Fort[],
}

export type InvasionByShip = {
    shipId: number
}