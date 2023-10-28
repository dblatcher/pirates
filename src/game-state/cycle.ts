import { splitArray } from "../lib/util";
import { createSplash, updateEffect } from "./effect";
import { updateProjectile } from "./projectile";
import { launchFromShip, updateShip } from "./ship";
import { Directive, GameState, Order } from "./types";

export const cycle = (gameState: GameState, directives: Directive[], pushLog: { (newLog: string): void }): GameState => {
    const game = { ...gameState }
    game.ships.forEach(ship => {
        updateShip(ship)
    })
    game.projectiles.forEach(projectile => {
        updateProjectile(projectile)
    })
    game.effects.forEach(effect => {
        updateEffect(effect)
    })

    const [projectilesInAir, projectilesLanded] = splitArray(game.projectiles, projectile => projectile.z > 0)
    game.projectiles = projectilesInAir
    projectilesLanded.forEach(projectile => {
        createSplash({ x: projectile.x, y: projectile.y, timeLeft: 50, radius: 2 }, game)
    })

    game.effects = game.effects.filter(effect => effect.timeLeft > 0)

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
                    const fired = launchFromShip(Math.PI * quantity, player, game)
                    pushLog(fired ? 'fired!' : `not loaded: ${player.cannonsCooldown}`)
                    break
                }
            }
        })
    }
    return game
}