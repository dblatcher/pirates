import type { AI } from "../../ai"
import { FactionId } from "../faction"
import { ShipCannon } from "./cannon-types"
import { Flag } from "./game-types"

export interface MastConfig {
    position: number,
    height: number,
    flag?: Flag,
}

export type ShipProfile = {
    maxHp: number,
    maxMarines: number,
    speed: number,
    maneuver: number,
    masts: MastConfig[],
}

export type Ship = {
    id: number,
    faction?: FactionId,
    name?: string,
    profile: ShipProfile,
    width: number,
    length: number,
    launchingInvasion?: boolean,
    boardingShip?: boolean,
    underRepair?: boolean,

    damage: number,
    marines: number,

    x: number,
    y: number,
    h: number,
    sailLevel: number,
    speedLastTurn: number
    turnsUnimpeded: number
    rowingBack?: boolean

    sailLevelTarget: number,
    wheel: number,
    cannons: ShipCannon[]
    ai?: AI
}