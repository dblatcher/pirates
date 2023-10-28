import { getXYVector } from "../lib/geometry";
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
        dz: 2,
        h: start.h
    })
}

export const updateProjectile = (projectile:Projectile) => {
    const forward = getXYVector(3, projectile.h)
    projectile.x = projectile.x += forward.x
    projectile.y = projectile.y += forward.y
    projectile.z = projectile.z += projectile.dz
    projectile.dz = projectile.dz -= .1
}