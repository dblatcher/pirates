import { getXYVector } from "../lib/geometry";
import { launch } from "./launch";
import { Directive, GameState, Order } from "./types";

export const cycle = (gameState: GameState, directives: Directive[], pushLog: { (newLog: string): void }): GameState => {

    const game = { ...gameState }

    game.ships.forEach(ship => {
        const forward = getXYVector(ship.sailLevel, ship.h)
        ship.x = ship.x += forward.x
        ship.y = ship.y += forward.y
    })

    game.projectiles.forEach(projectile => {
        const forward = getXYVector(3, projectile.h)
        projectile.x = projectile.x += forward.x
        projectile.y = projectile.y += forward.y
        projectile.z = projectile.z += projectile.dz
        projectile.dz = projectile.dz -= .1
    })

    game.projectiles = game.projectiles.filter(projectile => projectile.z > 0)

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
                case Order.FIRE: {
                    const { quantity = 0 } = directive
                    launch(Math.PI * quantity, player, game)
                    pushLog('fired!')
                    break
                }
            }
        })
    }
    return game
}