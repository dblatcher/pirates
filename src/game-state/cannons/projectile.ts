import { getXYVector, translate } from "../../lib/geometry";
import { splitArray } from "../../lib/util";
import { willProjectileHitFort, willProjectileHitShip, willProjectileHitTown } from "../collisions";
import { createGroundHit, createImpact, createSplash } from "../effect";
import { isLandAt } from "../land";
import { Cannon, GameState, MAXIMUM_DAMAGE_A_FORT_TAKES, Projectile } from "../model";
import { SoundEffectRequest } from "../model/sound";

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

export const updateCannon = (cannon: Cannon) => {
    if (cannon.cooldown > 0) {
        cannon.cooldown = cannon.cooldown - 1
    }
    if (cannon.countdown) {
        cannon.countdown = cannon.countdown - 1
        if (cannon.countdown === 0) {
            cannon.firing = true
        }
    }
}

export const handleProjectileHitsAndLandings = (game: GameState, _pushLog: { (newLog: string): void }, soundEffectRequests: SoundEffectRequest[]) => {
    const projectilesThatHitSomething: Projectile[] = []
    game.projectiles.forEach(projectile => {
        game.ships.forEach(ship => {
            if (willProjectileHitShip(projectile, ship)) {
                projectilesThatHitSomething.push(projectile)
                ship.damage = ship.damage + 1
                // pushLog(`Hit ${ship.name ?? 'a ship'} - ${ship.damage} / ${ship.profile.maxHp} damage`)
                createGroundHit({ ...projectile, timeLeft: 80 }, game)
                createImpact({ ...projectile, timeLeft: 50 }, game)
                soundEffectRequests.push({ position: ship, sfx: 'shipHit' })
            }
        })
        game.towns.forEach(town => {
            if (willProjectileHitTown(projectile, town)) {
                projectilesThatHitSomething.push(projectile)
                town.defences = Math.max(0, town.defences - 5)
                // pushLog(`Hit ${town.name}: ${town.defences}/${town.profile.maxDefences}`)
                createGroundHit({ ...projectile, timeLeft: 80 }, game)
                createImpact({ ...projectile, timeLeft: 50 }, game)
            } else {
                town.forts.forEach(fort => {
                    if (willProjectileHitFort(projectile, fort)) {
                        projectilesThatHitSomething.push(projectile)
                        fort.damage = Math.min(fort.damage + 1, MAXIMUM_DAMAGE_A_FORT_TAKES)
                        createGroundHit({ ...projectile, timeLeft: 80 }, game)
                    }
                })
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