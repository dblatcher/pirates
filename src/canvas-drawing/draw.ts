import { GameState, ViewPort } from "../game-state/types";
import { drawBackground } from "./drawBackground";
import { drawEffect } from "./drawEffect";
import { drawProjectile } from "./drawProjectile";
import { drawShip } from "./drawShip";
import { drawWithOffset } from "./drawWithOffSet";


export const drawScene = (game: GameState, viewPort: ViewPort) => (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) { return }
    const drawingMethods = drawWithOffset(ctx, viewPort)
    const { ships, projectiles, effects } = game
    ctx.clearRect(0, 0, viewPort.width, viewPort.height)
    drawBackground(ctx, drawingMethods, viewPort)
    ships.forEach(ship => drawShip(ctx, drawingMethods, ship))
    projectiles.forEach(projectile => drawProjectile(ctx, drawingMethods, projectile))
    effects.forEach(effect => drawEffect(ctx, drawingMethods, effect))
}
