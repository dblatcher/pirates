import { GameState } from "../game-state/types";
import { drawProjectile } from "./drawProjectile";
import { drawShip } from "./drawShip";


export const drawScene = (game: GameState) => (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) { return }
    const { ships, projectiles } = game
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ships.forEach(ship => drawShip(ctx, ship))
    projectiles.forEach(projectile => drawProjectile(ctx, projectile))
}
