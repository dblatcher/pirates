import { CellMatrix } from "../lib/path-finding/types";
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
                ship.damage = ship.damage + 1
                pushLog(`Hit ${ship.name ?? 'a ship'} - ${ship.damage} / ${ship.profile.maxHp} damage`)
                createGroundHit({ ...projectile, timeLeft: 80 }, game)
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

const removeSinkingShips = (game: GameState, pushLog: { (newLog: string): void }) => {
    const [shipsSinking, shipsNotSinking] = splitArray(game.ships, (ship => ship.damage >= ship.profile.maxHp))
    game.ships = shipsNotSinking
    shipsSinking.forEach(ship => {
        pushLog(`${ship.name||'a ship'} sinks!`)
        createSplash({ ...ship, radius: 30, timeLeft: 100 }, game)
        createSplash({ ...ship, radius: 25, timeLeft: 100 }, game)
        createSplash({ ...ship, radius: 20, timeLeft: 100 }, game)
    })
}

export const cycle = (
    gameState: GameState,
    playerDirectives: Directive[],
    matrix: CellMatrix,
    pushLog: { (newLog: string): void }
): GameState => {
    const game = { ...gameState }
    game.cycleNumber = game.cycleNumber + 1

    const [player] = game.ships
    if (player) {
        followDirectives(player, playerDirectives)
    }

    game.ships.forEach(ship => {
        if (!ship.ai) {
            return
        }
        followDirectives(ship, ship.ai.issueDirectives(ship, game))
    })

    // logic may be quite expensive - don't need to run every cycle
    // would be better to shard the ships and run some % each cycle
    // see effect on performance, then decide.
    if (game.cycleNumber % 100 == 0) {
        game.ships.forEach(ship => {
            if (!ship.ai) {
                return
            }
            ship.ai.updatePath(ship, game, matrix)
        })
    }

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
    // collisons.forEach(handleShipCollison)

    fireCannons(game)
    handleProjectileHitsAndLandings(game, pushLog)
    removeSinkingShips(game, pushLog)

    return game
}


