export type Ship = {
    x: number,
    y: number,
    h: number,
    width: number,
    length: number,
    name?: string,
}


export type GameState = {
    ships: Ship[],
}

export type Directive = 'LEFT' | 'RIGHT'