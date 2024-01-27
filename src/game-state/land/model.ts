export enum TerrainType {
    PLAIN,
    JUNGLE,
    DESERT,
    SWAMP,
}

export type CoastLines = {
    north: boolean,
    south: boolean,
    east: boolean,
    west: boolean,
}

export type TerrainSquare = {
    type: TerrainType,
    coastLines: CoastLines
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
    coasts: Array<Array<CoastLines | undefined>>
}