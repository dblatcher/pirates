import { getXYVector } from "../lib/geometry"
import { launchProjectile } from "./projectile"
import { GameState } from "./types"

export type Ship = {
    x: number,
    y: number,
    h: number,
    width: number,
    length: number,
    sailLevel: number,
    name?: string,
    // to do - model multiple cannons!
    cannonsCooldown: number,
}

export const updateShip = (ship: Ship) => {
    const forward = getXYVector(ship.sailLevel, ship.h)
    ship.x = ship.x += forward.x
    ship.y = ship.y += forward.y

    if (ship.cannonsCooldown > 0) {
        ship.cannonsCooldown = ship.cannonsCooldown - 1
    }
}

export const launchFromShip = (relativeH: number, ship: Ship, game: GameState): boolean => {
    if (ship.cannonsCooldown > 0) {
        return false
    }

    const direction = ship.h + relativeH
    launchProjectile({
        x: ship.x,
        y: ship.y,
        h: direction
    }, game)
    ship.cannonsCooldown = 200
    return true
}