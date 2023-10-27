import { GameState } from "./types";

export const initalState: GameState = {
    ships: [
        {
            x: 200,
            y: 200,
            h: Math.PI * .3,
            width: 20,
            length: 80,
        }
    ]
}