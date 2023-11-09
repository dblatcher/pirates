import type { AI } from "../../ai"
import { Faction } from "../faction"
import { Side } from "../types"

export type Cannon = {
    cooldown: number,
    firing?: boolean,
    side: Side
}

export type ShipProfile = {
    maxHp: number,
    speed: number,
    maneuver: number,
}

export type Ship = {
    id: number,
    faction?: Faction,
    name?: string,
    profile: ShipProfile,
    width: number,
    length: number,

    x: number,
    y: number,
    h: number,
    sailLevel: number,
    damage: number,
    speedLastTurn: number
    turnsUnimpeded: number

    sailLevelTarget: number,
    wheel: number,
    // to do - model multiple cannons per side!
    cannons: Cannon[]
    ai?: AI
}