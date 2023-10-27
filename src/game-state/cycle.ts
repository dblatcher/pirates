import { getXYVector } from "../lib/geometry";
import { Directive, GameState } from "./types";

export const cycle = (gameState: GameState, directives: Directive[]): GameState => {

    const game = { ...gameState }

    const [player] = game.ships

    if (player) {

        const forward = getXYVector(2, player.h)
        player.x = player.x += forward.x
        player.y = player.y += forward.y
        directives.forEach(directive => {
            switch (directive) {
                case "LEFT": player.h = player.h + Math.PI * .025; break
                case "RIGHT": player.h = player.h - Math.PI * .025; break
            }
        })
    }

    return game
}