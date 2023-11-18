import { getXYVector, translate } from "../lib/geometry";
import { splitArray } from "../lib/util";
import { willProjectileHitShip, willProjectileHitTown } from "./collisions";
import { createGroundHit, createImpact, createSplash } from "./effect";
import { isLandAt } from "./land";
import { GameState } from "./types";

export type Projectile = {
    x: number
    y: number
    z: number
    h: number
    dz: number
}

export const launchProjectile = (start: { x: number, y: number, h: number }, game: GameState) => {
    game.projectiles.push({
        x: start.x,
        y: start.y,
        z: 5,
        dz: 1,
        h: start.h
    })
}

export const getProjectilesNextPosition = (projectile: Projectile) => {
    return translate(projectile, getXYVector(3, projectile.h))
}

export const updateProjectile = (projectile: Projectile) => {
    const nextPosition = getProjectilesNextPosition(projectile)
    projectile.x = nextPosition.x
    projectile.y = nextPosition.y
    projectile.z = projectile.z += projectile.dz
    projectile.dz = projectile.dz -= .025
}


export const handleProjectileHitsAndLandings = (game: GameState, pushLog: { (newLog: string): void }) => {
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
        game.towns.forEach(town => {
            if (willProjectileHitTown(projectile,town)) {
                projectilesThatHitSomething.push(projectile)
                pushLog(`Hit ${town.name}`)
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