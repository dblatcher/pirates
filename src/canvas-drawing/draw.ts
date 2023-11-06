import { GameState, ViewPort } from "../game-state/types";
import { drawBackground } from "./drawBackground";
import { drawEffect } from "./drawEffect";
import { drawLand } from "./drawLand";
import { drawProjectile } from "./drawProjectile";
import { drawWithOffset } from "./drawWithOffSet";
import { drawShips } from "./ships";


export const drawScene = (game: GameState, viewPort: ViewPort) => (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) { return }
    const drawingMethods = drawWithOffset(ctx, viewPort)
    const { ships, projectiles, effects } = game
    ctx.clearRect(0, 0, viewPort.width, viewPort.height)
    drawBackground(ctx, drawingMethods, viewPort, game.cycleNumber)
    drawLand(ctx, drawingMethods, viewPort, game.land)

    // to do - filter out ships not in view
    drawShips(ctx, drawingMethods, ships, game.cycleNumber, false)

    projectiles.forEach(projectile => drawProjectile(ctx, drawingMethods, projectile))
    effects.forEach(effect => drawEffect(ctx, drawingMethods, effect))
}

