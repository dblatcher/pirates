import { XY, _90_DEG_LEFT, _90_DEG_RIGHT } from '../../lib/geometry'
import { Effect } from '../effects/effect'
import { Landmass } from '../land'
import type { Ship } from '../model'
import { Projectile } from './cannon-types'
import { Town } from './town-types'


export type Wind = {
    force: number;
    direction: number;
}

export type BoardingAction = {
    attackingShipId: number
    boardedShipId: number
    resolved: boolean
    numberOfAttackers: number
}
export type InvadingAction = {
    attackingShipId: number
    townId: number
    resolved: boolean
    numberOfAttackers: number
}

export type GameState = {
    playerId: number,
    wind: Wind;
    ships: Ship[];
    projectiles: Projectile[];
    effects: Effect[];
    surfaceEffects: Effect[];
    cycleNumber: number;
    land: Landmass[];
    towns: Town[];
    boardingActions: BoardingAction[];
    invadingActions: InvadingAction[];
    
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
    BOARD_SHIP,
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
    order: Order.RESET_WHEEL | Order.INVADE_TOWN | Order.BOARD_SHIP
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
