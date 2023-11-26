import { FortCannon } from "./cannon-types"
import { XY } from "../../lib/geometry"
import { Faction } from "../faction"

export type Fort = {
    distanceFromTown: XY,
    aimDirection: number,
    cannons: FortCannon[],
    damage: number,
}

export type TownProfile = {
    maxDefences: number
    maxGarrison: number
}

export type Town = XY & {
    faction?: Faction
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