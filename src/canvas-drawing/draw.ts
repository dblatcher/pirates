import { GameState, ViewPort } from "../game-state";
import { drawBackground } from "./drawBackground";
import { drawEffect } from "./drawEffect";
import { drawLand } from "./drawLand";
import { drawProjectile } from "./drawProjectile";
import { makeDrawingMethods } from "./drawWithOffSet";
import { drawShips } from "./ships";
import { drawTowns } from "./towns";


export const drawScene = (game: GameState, viewPort: ViewPort) => (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) { return }
    const drawingMethods = makeDrawingMethods(ctx, viewPort)
    const { projectiles, effects, towns } = game
    ctx.clearRect(0, 0, viewPort.width, viewPort.height)
    drawBackground(ctx, drawingMethods, viewPort, game.cycleNumber)
    drawLand(ctx, drawingMethods, viewPort, game.land)
    drawTowns(ctx, drawingMethods, towns, viewPort, game.cycleNumber, game.wind)
    drawShips(ctx, drawingMethods, viewPort, game, false)

    projectiles.forEach(projectile => drawProjectile(ctx, drawingMethods, projectile))
    effects.forEach(effect => drawEffect(ctx, drawingMethods, effect))
}


