export type Ship = {
    x: number,
    y: number,
    h: number,
    width: number,
    length: number,
    sailLevel: number,
    name?: string,
}

export type Projectile = {
    x: number
    y: number
    z: number
    h: number
    dz: number
}

export type GameState = {
    ships: Ship[],
    projectiles: Projectile[],
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