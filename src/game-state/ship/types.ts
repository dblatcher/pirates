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
    cannonsCooldownLeft: number,
    cannonsCooldownRight: number,
    firingLeft?: boolean,
    firingRight?: boolean,
}