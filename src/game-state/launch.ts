import { GameState, Ship } from "./types";

export const launch = (relativeH: number, ship: Ship, game: GameState) => {
    const direction = ship.h + relativeH
    game.projectiles.push({
        x: ship.x,
        y: ship.y,
        z: 5,
        dz: 2,
        h: direction
    })
}