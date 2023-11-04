import { splitArray } from "../lib/util";
import { willProjectileHitShip } from "./collisions";
import { createGroundHit, createImpact, createSplash, updateEffect } from "./effect";
import { isLandAt } from "./land";
import { Projectile, updateProjectile } from "./projectile";
import { followDirectives, launchFromShip, updateShip } from "./ship";
import { Collison, Directive, GameState } from "./types";


const fireCannons = (game: GameState) => {
    game.ships.forEach(ship => {
        ship.cannons.forEach(cannon => {
            if (cannon.firing) {
                launchFromShip(cannon, ship, game)
            }
        })
    })
}

const handleProjectileHitsAndLandings = (game: GameState, pushLog: { (newLog: string): void }) => {
    const projectilesThatHitSomething: Projectile[] = []
    game.projectiles.forEach(projectile => {
        game.ships.forEach(ship => {
            if (willProjectileHitShip(projectile, ship)) {
                projectilesThatHitSomething.push(projectile)
                pushLog(`Hit ${ship.name ?? 'a ship'}`)
                // TO DO - damage ship
                createImpact({ ...projectile, timeLeft: 50 }, game)
            }
        })
    })

    const projectilesThatDidNotHitAnyThing = game.projectiles.filter(projectile => !projectilesThatHitSomething.includes(projectile))
    const [projectilesInAir, projectilesLanded] = splitArray(projectilesThatDidNotHitAnyThing, projectile => projectile.z > 0)
    
    // TO DO - if they land offscreen, don't bother with the effect
    projectilesLanded.forEach(projectile => {
        if (isLandAt(projectile, game.land)) {
            createGroundHit({ x: projectile.x, y: projectile.y, timeLeft: 60, }, game)
        } else {
            createSplash({ x: projectile.x, y: projectile.y, timeLeft: 50, radius: 2 }, game)
        }
    })
    game.projectiles = projectilesInAir
}

// const handleShipCollison = (collision:Collison) => {
//     const {ship,vector, obstacle} = collision
// } 

export const cycle = (
    gameState: GameState,
    directives: Directive[],
    pushLog: { (newLog: string): void }
): GameState => {
    const game = { ...gameState }
    game.cycleNumber = game.cycleNumber + 1

    const [player] = game.ships
    if (player) {
        followDirectives(player, directives)
    }

    game.ships.forEach(ship => {
        if (!ship.ai) {
            return
        }
        followDirectives(ship, ship.ai.issueDirectives(game))
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

    handleProjectileHitsAndLandings(game, pushLog)

    // TO DO - handle collisions
    // collisons.forEach(handleShipCollison)


    fireCannons(game)

    return game
}


