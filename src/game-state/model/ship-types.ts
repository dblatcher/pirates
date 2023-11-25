import type { AI } from "../../ai"
import { Faction } from "../faction"
import { ShipCannon } from "./cannon-types"
import { Flag } from "./game-types"

export interface MastConfig {
    position: number,
    height: number,
    flag?: Flag,
}

export type ShipProfile = {
    maxHp: number,
    speed: number,
    maneuver: number,
    masts: MastConfig[],
}

export type Ship = {
    id: number,
    faction?: Faction,
    name?: string,
    profile: ShipProfile,
    width: number,
    length: number,
    launchingInvasion?: boolean,
    underRepair?: boolean,

    x: number,
    y: number,
    h: number,
    sailLevel: number,
    damage: number,
    speedLastTurn: number
    turnsUnimpeded: number

    sailLevelTarget: number,
    wheel: number,
    cannons: ShipCannon[]
    ai?: AI
}