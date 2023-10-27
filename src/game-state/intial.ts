import { GameState } from "./types";

export const initalState: GameState = {
    ships: [
        {
            x: 200,
            y: 200,
            h: Math.PI * .3,
            width: 20,
            length: 80,
            sailLevel: 0
        },
        {
            x: 100,
            y: 100,
            h: Math.PI * 1,
            width: 15,
            length: 40,
            sailLevel: 0.5
        },
        {
            x: 200,
            y: 300,
            h: Math.PI * 1.4,
            width: 15,
            length: 40,
            sailLevel: 0.5
        },
    ]
}