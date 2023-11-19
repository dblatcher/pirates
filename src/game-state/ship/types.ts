import type { AI } from "../../ai"
import { Faction } from "../faction"
import { InvasionByShip, Flag, Side } from "../types"

export type Cannon = {
    cooldown: number,
    firing?: boolean,
    side: Side,
    position: number,
    countdown?: number,
}

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
    invasionInProgress?: InvasionByShip,
    launchingInvasion?: boolean,

    x: number,
    y: number,
    h: number,
    sailLevel: number,
    damage: number,
    speedLastTurn: number
    turnsUnimpeded: number

    sailLevelTarget: number,
    wheel: number,
    cannons: Cannon[]
    ai?: AI
}