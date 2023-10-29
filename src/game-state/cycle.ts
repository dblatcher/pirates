import { willProjectileHitShip } from "./collisions";
import { splitArray } from "../lib/util";
import { createImpact, createSplash, updateEffect } from "./effect";
import { Projectile, updateProjectile } from "./projectile";
import { followDirectives, updateShip } from "./ship";
import { Collison, Directive, GameState } from "./types";

export const cycle = (gameState: GameState, directives: Directive[], pushLog: { (newLog: string): void }): GameState => {
    let game = { ...gameState }
    game.cycleNumber = game.cycleNumber + 1
    
    const projectilesThatHitSomething: Projectile[] = []
    game.projectiles.forEach(projectile => {
        game.ships.forEach(ship => {
            if (willProjectileHitShip(projectile, ship)) {
                projectilesThatHitSomething.push(projectile)
                pushLog(`Hit ${ship.name ?? 'a ship'}`)
                createImpact({ ...projectile, timeLeft: 50 }, game)
            }
        })
    })

    const projectilesThatDidNotHitAnyThing = game.projectiles.filter(projectile => !projectilesThatHitSomething.includes(projectile))
    
    const collisons: Collison[] = []
    game.ships.forEach(ship => {
        updateShip(ship, gameState, collisons)
    })
    game.projectiles.forEach(projectile => {
        updateProjectile(projectile)
    })
    game.effects.forEach(effect => {
        updateEffect(effect)
    })

    // TO DO - handle collisions

    const [projectilesInAir, projectilesLanded] = splitArray(projectilesThatDidNotHitAnyThing, projectile => projectile.z > 0)
    game.projectiles = projectilesInAir
    projectilesLanded.forEach(projectile => {
        createSplash({ x: projectile.x, y: projectile.y, timeLeft: 50, radius: 2 }, game)
    })

    game.effects = game.effects.filter(effect => effect.timeLeft > 0)

    // Should we do this first?
    const [player] = game.ships
    if (player) {
        game = followDirectives(player, directives, game, pushLog)
    }
    return game
}


