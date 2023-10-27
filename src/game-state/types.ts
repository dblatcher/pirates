export type Ship = {
    x: number,
    y: number,
    h: number,
    width: number,
    length: number,
    sailLevel: number,
    name?: string,
}


export type GameState = {
    ships: Ship[],
}

export enum Order {
    LEFT,
    RIGHT,
    SAILS,
}

export type Directive = {
    order: Order,
    quantity?: number,
}