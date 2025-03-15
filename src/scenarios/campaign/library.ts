import { browShapes } from "@dblatcher/funny-face";
import { Person } from "../scenarios";
import { StrawHatIconPng, eyePatch, } from "../../assets";
import { TERRAIN_SQUARE_SIZE, Town } from "../../game-state";
import { Landmass, LandmassInput, inputToLandmass, stringToTerrainGrid } from "../../game-state/land";
import { makeTownWithForts } from "../../game-state/towns";
import { FactionId } from "../../game-state/faction";


export const ROBERT: Person = {
    name: "Admiral Lord Robert Malden of Carlise",
    size: 80,
    profile: {
        browShape: browShapes.WIDE,
        eyeColor: 'purple',
        width: .9,
        color: 'coral',
        lipColor: 'crimson'
    },
    accessories: [
        {
            x: 0, y: -20, src: StrawHatIconPng, width: 120,
        }
    ]
}

export const BARNEY: Person = {
    name: "Captain Barnabous 'Skullface' Hooke",
    size: 80,
    profile: {
        browShape: browShapes.THIN,
        eyeColor: 'red',
        width: .7,
        eyeDistance: 30,
        noseHeight: 10,
        noseWidth: 20,
        color: 'aqua',
        lipWidth: 5,
        lipColor: 'brown'
    },
    accessories: [
        { x: 0, y: 0, src: eyePatch, width: 100, place: 'right-eye' }
    ]
}


export const MAP_HEIGHT = 38 * TERRAIN_SQUARE_SIZE;
export const MAP_WIDTH = 48 * TERRAIN_SQUARE_SIZE;

const _ = undefined;

export const TERRA_FIRMA: LandmassInput = {
    x: 4 * TERRAIN_SQUARE_SIZE, y: TERRAIN_SQUARE_SIZE * 32,
    shape: [
        [_, _, _, _, _, _, _, _, _, _, _, _, _, _, 0, 0, 0, 0, _, _, _, _, 0],
        [_, _, _, _, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _, _, 0, 0, _, _, _, _, _, _, 0, 0, 0],
        [_, _, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [_, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]
}

const LAND_BRIDGE: LandmassInput = {
    x: TERRAIN_SQUARE_SIZE * 1, y: TERRAIN_SQUARE_SIZE * 3,
    shape: [
        [0, 0, 0, 0, _, _, _],
        [_, 0, 0, 0, _, _, _],
        [_, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [_, 0, 0],
        [_, 0, 0, 0,],
        [_, 0, 0, 0,],
        [_, 0, 0, 0,],
        [_, 0, 0, 0,],
        [_, 0, 0, 0,],
        [_, _, 0, 0, 0],
        [_, _, _, 0, 0],
        [_, _, _, 0, 0],
        [_, _, 0, 0],
        [_, _, 0, 0],
        [_, _, 0, 0, 0, 0],
        [_, _, 0, 0, 0, 0, 0, 0],
        [_, _, _, 0, 0, 0, 0, 0, 0],
        [_, _, _, _, 0, 0, 0, 0, 0, 0, 0],
        [_, _, _, _, _, _, 0, 0, 0, 0, 0, 0],
        [_, _, _, _, _, _, 0, 0, 0, 0, 0, 0, 0],
        [_, _, _, _, _, _, 0, 0, 0, 0, 0, 0, 0, 0],
        [_, _, _, _, _, _, _, 0, 0, 0, 0, 0, 0, 0],
        [_, _, _, _, _, _, _, 0, 0, 0, 0, 0, 0],
        [_, _, _, _, _, _, _, 0, 0, 0, 0, 0, 0],
        [_, _, _, _, _, _, _, 0, 0, 0, 0, 0, 0],
        [_, _, _, _, _, _, _, _, 0, 0, 0, 0, _],
        [_, _, _, _, _, _, _, _, 0, 0, 0, 0, _],
        [_, _, _, _, _, _, _, 0, 0, 0, _, _],
        [_, _, _, _, _, _, _, _, 0, 0, _],
    ]
}


const NORTH_SHORE: LandmassInput = {
    x: 0, y: TERRAIN_SQUARE_SIZE * 0,
    shape: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _, _, _, _, _, _, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [_, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _, _,],
        [_, _, _, _, _, _, _, _, _, _, _, _, 0, 0, 0, 0, _, _, _, _,],
    ]
}

const GROUPELLE_ISLAND: LandmassInput = {
    x: TERRAIN_SQUARE_SIZE * 6,
    y: TERRAIN_SQUARE_SIZE * 5,
    shape: [
        [0, 3, 0],
        [0, 0, 0],
        [2, 0],
        [2],
        [2],
    ]
};

const CANTO_ISLAND: LandmassInput = {
    x: TERRAIN_SQUARE_SIZE * 18,
    y: TERRAIN_SQUARE_SIZE * 22,
    shape: stringToTerrainGrid(`
22
222
2 2
22
22
`, 3, 5)
};

const SANDBANK: LandmassInput = {
    x: TERRAIN_SQUARE_SIZE * 20,
    y: TERRAIN_SQUARE_SIZE * 11,
    shape: [
        [2, 2],
        [2],
        [2],
        [2, 2],
        [2, 2],
    ]
};

const SWAMPY_BIT: LandmassInput = {
    x: TERRAIN_SQUARE_SIZE * 28,
    y: TERRAIN_SQUARE_SIZE * 18,
    shape: [
        [_, _, _, 1, 1],
        [_, _, _, 1, 1],
        [_, _, _, 1, 1],
        [_, _, _, 1, 1, 1],
        [_, _, 3, 3, 1, 1],
        [_, _, _, 3, 1, 1],
    ]
};

export const landMasses: Landmass[] = [
    NORTH_SHORE,
    LAND_BRIDGE,
    GROUPELLE_ISLAND,
    CANTO_ISLAND,
    TERRA_FIRMA,
    SANDBANK,
    SWAMPY_BIT,
].map(inputToLandmass);

export const townIds = {
    GROUPELLE: 1,
    CANTO: 2,
    TEULVILLE: 3,
    HAVEN: 4,
    PUERTOFORTO: 5,
}

export const makeTownLaGroupelle = (): Town => makeTownWithForts({
    faction: 'grance',
    x: GROUPELLE_ISLAND.x + TERRAIN_SQUARE_SIZE * 2,
    y: GROUPELLE_ISLAND.y + TERRAIN_SQUARE_SIZE * 1,
    id: townIds.GROUPELLE,
    name: 'La Groupelle',
    defences: 1,
    profile: {
        maxDefences: 100,
        maxGarrison: 25,
    },
    garrison: 20,
}, [
    { x: 0, y: 100 },
    { x: 75, y: -50 },
])

export const makeTownCanto = (faction: FactionId): Town => makeTownWithForts({
    faction,
    x: CANTO_ISLAND.x + TERRAIN_SQUARE_SIZE * 1,
    y: CANTO_ISLAND.y + TERRAIN_SQUARE_SIZE * 1,
    id: townIds.CANTO,
    name: 'Villa della Canto',
}, [
    // { x: -25, y: -100 },
    // { x: -125, y: 0 },
    // { x: 125, y: 0 },
])

export const makeTownTeulville = (): Town => makeTownWithForts({
    faction: 'grance',
    x: LAND_BRIDGE.x + TERRAIN_SQUARE_SIZE * 4,
    y: LAND_BRIDGE.y + TERRAIN_SQUARE_SIZE * 12,
    id: townIds.TEULVILLE,
    name: 'Teulville',
    profile: {
        maxDefences: 100,
        maxGarrison: 25,
    },
    garrison: 25,
}, [
])

export const makeTownHaven = (): Town => makeTownWithForts({
    faction: undefined,
    x: TERRA_FIRMA.x + TERRAIN_SQUARE_SIZE * 25,
    y: TERRA_FIRMA.y + TERRAIN_SQUARE_SIZE * 3,
    id: townIds.HAVEN,
    name: "Pirates' Haven",
    profile: {
        maxDefences: 100,
        maxGarrison: 25,
    },
    garrison: 25,
}, [
])

export const makeTownForto = (): Town => makeTownWithForts({
    faction: 'spaim',
    x: TERRAIN_SQUARE_SIZE * 32,
    y: TERRAIN_SQUARE_SIZE * 2,
    id: townIds.PUERTOFORTO,
    name: "Puerto Forto",
    profile: {
        maxDefences: 100,
        maxGarrison: 25,
    },
    garrison: 20,
}, [
    { x: 0, y: 120 },
    { x: 75, y: -50 },
    { x: -75, y: -50 },
])
