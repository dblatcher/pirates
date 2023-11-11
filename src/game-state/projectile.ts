import { getXYVector, translate } from "../lib/geometry";
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