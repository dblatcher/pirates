import { browShapes } from "@dblatcher/funny-face";
import { Person } from "..";
import { LandmassInput } from "../../game-state/land";

export const tutorialPerson: Person = {
    name: "Captian Blunderheim",
    size: 75,
    profile: {
        browShape: browShapes.THIN,
        eyeColor: 'green',
        width: .95,
        color: 'pink',
        lipColor: 'crimson'
    },
    accessories: [

    ]
}

const U = undefined
export const tutorialLagoon: LandmassInput[] = [
    {
        x: 0, y: 0, shape: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, U, 1, 1, 1, U, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, U, 1],
            [1, U, 1, U, U, U, U, U, U, 1, U, U, 1, 1, 1, 1, 1, U, U, 1],
            [1, 0, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, 2, 1],
            [1, 0, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, 2, 1],
            [1, 0, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, 0, 1],
            [1, 0, 0, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, 0, 1],
            [1, 0, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, 0, 1],
            [1, 0, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, 0, 1],
            [1, 0, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, 1, 1],
            [1, 0, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, 1, 1],
            [1, 1, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, 1, 1],
            [1, 1, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, 1, 1],
            [1, 1, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, 1, 1],
            [1, 1, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, 1, 1],
            [1, 1, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, 1, 1],
            [1, 1, 1, U, U, U, U, U, U, U, U, U, U, U, U, U, U, U, 1, 1],
            [1, 1, 1, 1, 1, U, U, U, U, U, U, U, U, U, U, U, U, U, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ]
    }
]