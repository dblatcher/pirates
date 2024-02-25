import { browShapes } from "@dblatcher/funny-face";
import { Person } from "../scenarios";
import { StrawHatIconPng } from "../../assets";
import { TERRAIN_SQUARE_SIZE, Town } from "../../game-state";
import { Landmass, LandmassInput, inputToLandmass } from "../../game-state/land";
import { makeTownWithForts } from "../../game-state/towns";


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


export const MAP_HEIGHT = 38 * TERRAIN_SQUARE_SIZE;
export const MAP_WIDTH = 48 * TERRAIN_SQUARE_SIZE;

const _ = undefined;

const TERRA_FIRMA: LandmassInput = {
    x: 0, y: TERRAIN_SQUARE_SIZE * 32,
    shape: [
        [_, _, _, _, _, _, _, _, _, _, _, _, 0, 0, 0, 0, _, _, _, _, 0],
        [_, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _, _, 0, 0, _, _, _, _, _, _, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]
}

const NORTH_SHORE: LandmassInput = {
    x: 0, y: TERRAIN_SQUARE_SIZE * 0,
    shape: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [_, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, _, _,],
        [_, _, _, _, _, _, _, _, _, _, _, _, 0, 0, 0, 0, _, _, _, _,],
    ]
}

const GROUPELLE_ISLAND: LandmassInput = {
    x: TERRAIN_SQUARE_SIZE * 4,
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
    x: TERRAIN_SQUARE_SIZE * 9,
    y: TERRAIN_SQUARE_SIZE * 15,
    shape: [
        [2, 2],
        [2, 2, 2],
        [2, _, 2],
        [2, 2],
        [2, 2],
    ]
};

const SANDBANK: LandmassInput = {
    x: TERRAIN_SQUARE_SIZE * 3,
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
    x: TERRAIN_SQUARE_SIZE * 22,
    y: TERRAIN_SQUARE_SIZE * 18,
    shape: [
        [_, _, _, 1, 1],
        [_, _, _, 1, 1],
        [_, _, _, 1, 1],
        [_, _, _, 1, 1, 1],
        [_, _, 0, 0, 1, 1],
        [_, _, _, 0, 1, 1],
    ]
};

export const demoLand: Landmass[] = [
    NORTH_SHORE,
    GROUPELLE_ISLAND,
    CANTO_ISLAND,
    TERRA_FIRMA,
    SANDBANK,
    SWAMPY_BIT,
].map(inputToLandmass);

export const makeDemoTowns = (level: 1 | 2): Town[] => {

    return [
        makeTownWithForts({
            faction: 'grance',
            x: GROUPELLE_ISLAND.x + TERRAIN_SQUARE_SIZE * 2,
            y: GROUPELLE_ISLAND.y + TERRAIN_SQUARE_SIZE * 1,
            id: 1,
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
        ]),
        makeTownWithForts({
            faction: level === 1 ? 'spaim' : 'grance',
            x: CANTO_ISLAND.x + TERRAIN_SQUARE_SIZE * 1,
            y: CANTO_ISLAND.y + TERRAIN_SQUARE_SIZE * 1,
            id: 2,
            name: 'Villa della Canto',
        }, [
            // { x: -25, y: -100 },
            // { x: -125, y: 0 },
            // { x: 125, y: 0 },
        ]),
    ]
}