import { willProjectileHitShip } from "./collisions";
import { splitArray } from "../lib/util";
import { createImpact, createSplash, updateEffect } from "./effect";
import { Projectile, updateProjectile } from "./projectile";
import { followDirectives, launchFromShip, updateShip } from "./ship";
import { Collison, Directive, GameState } from "./types";


const fireCannons = (game: GameState) => {
    game.ships.forEach(ship => {
        if (ship.firingLeft) {
            launchFromShip(Math.PI * -.5, ship, game)
        }
        ship.firingLeft = false
        if (ship.firingRight) {
            launchFromShip(Math.PI * .5, ship, game)
        }
        ship.firingRight = false
    })
}

export const cycle = (gameState: GameState, directives: Directive[], pushLog: { (newLog: string): void }): GameState => {
    const game = { ...gameState }
    game.cycleNumber = game.cycleNumber + 1

    const [player] = game.ships
    if (player) {
        followDirectives(player, directives)
    }

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
    const [projectilesInAir, projectilesLanded] = splitArray(projectilesThatDidNotHitAnyThing, projectile => projectile.z > 0)
    game.projectiles = projectilesInAir
    projectilesLanded.forEach(projectile => {
        createSplash({ x: projectile.x, y: projectile.y, timeLeft: 50, radius: 2 }, game)
    })

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
    game.effects = game.effects.filter(effect => effect.timeLeft > 0)

    // TO DO - handle collisions

    fireCannons(game)

    return game
}


