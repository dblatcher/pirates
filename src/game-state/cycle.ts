import { getXYVector } from "../lib/geometry";
import { Directive, GameState, Order } from "./types";

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
            switch (directive.order) {
                case Order.LEFT: player.h = player.h + Math.PI * .025; break
                case Order.RIGHT: player.h = player.h - Math.PI * .025; break
                case Order.SAILS: {
                    const { quantity = 0 } = directive
                    player.sailLevel = quantity
                    break;
                }
            }
        })
    }
    return game
}