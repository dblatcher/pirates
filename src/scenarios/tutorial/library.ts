import { browShapes } from "@dblatcher/funny-face";
import { Person } from "..";
import { LandmassInput } from "../../game-state/land";
import { makeTown } from "../../game-state/towns";
import { captainHatPng } from "../../assets";

export const tutorialPerson: Person = {
    name: "Captain Blunderheim",
    size: 75,
    profile: {
        browShape: browShapes.THIN,
        eyeColor: 'green',
        width: .95,
        color: 'pink',
        lipColor: 'crimson',
        noseHeight: 8,
        noseWidth: 20,
        mouthNoseDistance: 15,
    },
    accessories: [
        {
            src: captainHatPng,
            x: 0, y: -70, width: 170,
        }
    ]
}

const _ = undefined
export const tutorialLagoon: LandmassInput[] = [
    {
        x: 0, y: 0, shape: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, _, 1, 1, 1, _, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, _, 1],
            [1, _, 1, _, _, _, _, _, _, 1, _, _, 1, 1, 1, 1, 1, _, _, 1],
            [1, 0, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 2, 1],
            [1, 0, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 2, 1],
            [1, 0, _, _, _, _, _, _, _, _, _, _, _, _, 2, 2, _, _, 0, 1],
            [1, 0, 0, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 0, 1],
            [1, 0, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 0, 1],
            [1, 0, _, _, _, _, _, _, _, 2, _, _, _, _, _, _, _, _, 0, 1],
            [1, 0, _, _, _, _, _, _, 2, 2, 2, _, _, _, _, _, _, _, 1, 1],
            [1, 0, _, _, _, _, _, _, _, 2, 2, 2, _, _, _, _, _, _, 1, 1],
            [1, 1, _, _, _, _, _, _, _, 2, _, _, _, _, _, _, _, _, 1, 1],
            [1, 1, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 1, 1],
            [1, 1, _, _, _, 2, _, _, _, _, _, _, _, _, _, _, _, _, 1, 1],
            [1, 1, _, _, _, 2, 2, _, _, _, _, _, _, _, _, _, _, _, 1, 1],
            [1, 1, _, _, _, _, 2, _, _, _, _, _, _, _, _, _, _, _, 1, 1],
            [1, 1, 1, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 1, 1],
            [1, 1, 1, 1, 1, _, _, _, _, _, _, _, _, _, _, _, _, _, _, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, _, _],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, _, _],
        ]
    }
]

export const makeTownOne = () => makeTown({
    id: 1,
    name: 'Townsville',
    faction: 'grance',
    x: 900,
    y: 900,
})