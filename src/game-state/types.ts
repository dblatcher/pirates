import { XY, _90_DEG_LEFT, _90_DEG_RIGHT } from '../lib/geometry'
import { Effect } from './effect'
import { Faction } from './faction'
import { Landmass } from './land'
import type { Projectile } from './projectile'
import type { Ship } from './ship'

export type { Projectile } from './projectile'
export type { Ship } from './ship'

export const MAX_WIND = 10;
export type Wind = {
    force: number;
    direction: number;
}


export type GameState = {
    playerId: number,
    wind: Wind;
    ships: Ship[];
    projectiles: Projectile[];
    effects: Effect[];
    cycleNumber: number;
    land: Landmass[];
    towns: Town[];
}

export type ViewPort = {
    x: number;
    y: number;
    width: number;
    height: number;
}

export type Collison = {
    ship: Ship;
    vector: XY;
    obstacle: Ship;
    speedWhenHit: number;
}

export enum Order {
    SAILS_TO,
    FIRE,
    SAILS_BY,
    HEADING_TO,
    RESET_WHEEL,
    WHEEL_TO,
    INVADE_TOWN,
}

export enum Side {
    LEFT, RIGHT
}

export enum FiringPattern {
    BROADSIDE, CASCADE, ALTERNATE
}

export const anglesBySide: Record<Side, number> = {
    [Side.LEFT]: _90_DEG_LEFT,
    [Side.RIGHT]: _90_DEG_RIGHT,
}

type QuantityDirective = {
    order: Order.HEADING_TO | Order.SAILS_BY | Order.SAILS_TO | Order.WHEEL_TO
    quantity?: number;
}

type PlainDirective = {
    order: Order.RESET_WHEEL | Order.INVADE_TOWN
}

type FireDirective = {
    order: Order.FIRE
    side: Side
    pattern: FiringPattern
}

export type Directive = QuantityDirective | PlainDirective | FireDirective

export type Flag = {
    shape: 'triangle' | 'rectangle'
    length: number,
    height: number,
}

export const TOWN_SIZE = 100
export const DEFENCES_TO_REPEL_INVADERS = 20
export type TownProfile = {
    maxDefences: number
}
export type Town = XY & {
    faction?: Faction
    name: string,
    id: number,
    defences: number,
    profile: TownProfile,
}

export type InvasionByShip = {
    townId: number
    /** 
     *  A track of progress towards conquering the town.  
     *  0 = just started
     *  100 = won
     *  -100 = repealed?
     * */
    victory: number
}