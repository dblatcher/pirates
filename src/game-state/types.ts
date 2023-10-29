import { Effect } from './effect'
import type { Projectile } from './projectile'
import type { Ship } from './ship'

export type { Ship } from './ship'
export type { Projectile } from './projectile'


export type GameState = {
    ships: Ship[],
    projectiles: Projectile[],
    effects: Effect[],
    cycleNumber: number
}

export type ViewPort = {
    x: number,
    y: number,
    width: number,
    height: number,
}

export enum Order {
    LEFT,
    RIGHT,
    SAILS_TO,
    FIRE,
    SAILS_BY,
}

export type Directive = {
    order: Order,
    quantity?: number,
}