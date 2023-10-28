import { Effect } from './effect'
import type { Projectile } from './projectile'
import type { Ship } from './ship'

export type { Ship } from './ship'
export type { Projectile } from './projectile'


export type GameState = {
    ships: Ship[],
    projectiles: Projectile[],
    effects: Effect[],
}

export enum Order {
    LEFT,
    RIGHT,
    SAILS,
    FIRE,
}

export type Directive = {
    order: Order,
    quantity?: number,
}