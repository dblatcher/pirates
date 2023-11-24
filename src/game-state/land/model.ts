export enum TerrainType {
    PLAIN,
    JUNGLE,
    DESERT,
    SWAMP,
}

export type Landmass = {
    x: number,
    y: number,
    shape: Array<Array<TerrainType | undefined>>
}