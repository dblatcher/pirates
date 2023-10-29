export type Cannon = {
    cooldown: number,
    firing?: boolean,
    side: 'LEFT' | 'RIGHT'
}

export type Ship = {
    x: number,
    y: number,
    h: number,
    width: number,
    length: number,
    sailLevel: number,
    sailLevelTarget: number,
    name?: string,
    // to do - model multiple cannons!
    cannons: Cannon[]
}