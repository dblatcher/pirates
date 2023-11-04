import { XY } from '../lib/geometry'
import { Effect } from './effect'
import { Landmass } from './land'
import type { Projectile } from './projectile'
import type { Ship } from './ship'

export type { Ship } from './ship'
export type { Projectile } from './projectile'


export type GameState = {
    ships: Ship[],
    projectiles: Projectile[],
    effects: Effect[],
    cycleNumber: number
    land: Landmass[]
}

export type ViewPort = {
    x: number,
    y: number,
    width: number,
    height: number,
}

export type Collison = {
    ship: Ship;
    vector: XY;
    obstacle: Ship
}

export enum Order {
    LEFT,
    RIGHT,
    SAILS_TO,
    FIRE,
    SAILS_BY,
    HEADING_TO,
    RESET_WHEEL,
}

export enum Side {
    LEFT, RIGHT
}

export type Directive = {
    order: Order,
    quantity?: number,
    side?: Side
}