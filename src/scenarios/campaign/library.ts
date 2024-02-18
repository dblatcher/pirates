import { browShapes } from "@dblatcher/funny-face";
import { Person } from "../scenarios";
import { StrawHatIconPng } from "../../assets";
import { Town } from "../../game-state";
import { Landmass, TerrainType, inputToLandmass } from "../../game-state/land";
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

export const demoLand: Landmass[] = [
    {
        x: 100,
        y: 100,
        shape: [
            [TerrainType.PLAIN, TerrainType.SWAMP, TerrainType.PLAIN],
            [TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.PLAIN],
            [TerrainType.DESERT, TerrainType.PLAIN],
            [TerrainType.DESERT],
            [TerrainType.DESERT],
        ]
    },
    {
        x: 150,
        y: 450,
        shape: [
            [TerrainType.DESERT, TerrainType.DESERT],
            [TerrainType.DESERT],
            [TerrainType.DESERT],
            [TerrainType.DESERT, TerrainType.DESERT],
            [TerrainType.DESERT, TerrainType.DESERT],
        ]
    },
    {
        x: 550,
        y: 750,
        shape: [
            [TerrainType.DESERT, TerrainType.DESERT],
            [TerrainType.DESERT, TerrainType.DESERT, TerrainType.DESERT],
            [TerrainType.DESERT, undefined, TerrainType.DESERT],
            [TerrainType.DESERT, TerrainType.DESERT],
            [TerrainType.DESERT, TerrainType.DESERT],
        ]
    },
    {
        x: 600,
        y: 1300,
        shape: [
            [undefined, undefined, undefined, TerrainType.JUNGLE, TerrainType.JUNGLE],
            [undefined, undefined, undefined, TerrainType.JUNGLE, TerrainType.JUNGLE],
            [undefined, undefined, undefined, TerrainType.JUNGLE, TerrainType.JUNGLE],
            [undefined, undefined, undefined, TerrainType.JUNGLE, TerrainType.JUNGLE, TerrainType.JUNGLE],
            [undefined, undefined, TerrainType.PLAIN, TerrainType.PLAIN, TerrainType.JUNGLE, TerrainType.JUNGLE],
            [undefined, undefined, undefined, TerrainType.PLAIN, TerrainType.JUNGLE, TerrainType.JUNGLE],
        ]
    }
].map(inputToLandmass);

export const makeDemoTowns = (level: 1 | 2): Town[] => {

    return [
        makeTownWithForts({
            faction: 'grance',
            x: 150,
            y: 150,
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
            { x: -50, y: -50 },
        ]),
        makeTownWithForts({
            faction: level === 1 ? 'spaim' : 'grance',
            // faction: 'grance',
            x: 600,
            y: 800,
            id: 2,
            name: 'Villa della Canto',
        }, [
            // { x: -25, y: -100 },
            // { x: -125, y: 0 },
            // { x: 125, y: 0 },
        ]),
    ]
}