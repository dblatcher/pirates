import { Directive, GameState } from "./types";

export const cycle = (gameState: GameState, directives: Directive[]): GameState => {

    const game = { ...gameState }

    const r = Math.floor(Math.random() * 10) - 4
    game.y += r

    directives.forEach(directive => {
        switch (directive) {
            case "LEFT": game.x = game.x - 5; break
            case "RIGHT": game.x = game.x + 5; break
        }
    })

    return game
}