import type { AI } from "../../ai"
import { Side } from "../types"

export type Cannon = {
    cooldown: number,
    firing?: boolean,
    side: Side
}

export type Ship = {
    id: number,
    x: number,
    y: number,
    h: number,
    width: number,
    length: number,
    sailLevel: number,
    sailLevelTarget: number,
    wheel: number,
    name?: string,
    // to do - model multiple cannons per side!
    cannons: Cannon[]
    ai?: AI
}