import { getXYVector } from "../lib/geometry";
import { Directive, GameState } from "./types";

export const cycle = (gameState: GameState, directives: Directive[]): GameState => {

    const game = { ...gameState }

    game.ships.forEach(ship => {
        const forward = getXYVector(ship.sailLevel, ship.h)
        ship.x = ship.x += forward.x
        ship.y = ship.y += forward.y
    })

    const [player] = game.ships
    if (player) {
        directives.forEach(directive => {
            switch (directive) {
                case "LEFT": player.h = player.h + Math.PI * .025; break
                case "RIGHT": player.h = player.h - Math.PI * .025; break
            }
        })
    }
    return game
}