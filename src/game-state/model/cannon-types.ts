import { Side } from "./game-types"

export type Cannon = {
    cooldown: number,
    firing: boolean,
    position: number,
    countdown?: number,
}

export type ShipCannon = Cannon & {
    side: Side,
}

export type FortCannon = Cannon;

export type Projectile = {
    x: number
    y: number
    z: number
    h: number
    dz: number
}
