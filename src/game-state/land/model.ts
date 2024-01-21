export enum TerrainType {
    PLAIN,
    JUNGLE,
    DESERT,
    SWAMP,
}

export type TerrainSquare = {
    type: TerrainType
}

export type LandmassInput = {
    x: number,
    y: number,
    shape: Array<Array<TerrainType | undefined>>
}

export type Landmass = {
    x: number,
    y: number,
    shape: Array<Array<TerrainSquare | undefined>>
}