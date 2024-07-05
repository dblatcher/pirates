import { GameState, ViewPort } from "../game-state";
import { drawEffect } from "./drawEffect";
import { drawBoardingAction, drawInvadingAction } from "./drawAction";
import { drawLand } from "./drawLand";
import { drawProjectile } from "./drawProjectile";
import { makeDrawingMethods } from "./drawWithOffSet";
import { drawShips } from "./ships";
import { drawTowns } from "./towns";
import { AssetMap } from "../context/asset-context";


export const drawScene = (game: GameState, viewPort: ViewPort, assets: AssetMap) => (canvases: (HTMLCanvasElement | null)[]) => {
    const [background_canvas, sprite_canvas] = canvases
    const { projectiles, effects, towns, surfaceEffects, invadingActions, boardingActions } = game

    if (background_canvas) {
        const ctx = background_canvas.getContext('2d')
        if (!ctx) { return }
        const drawingMethods = makeDrawingMethods(ctx, viewPort)
        ctx.clearRect(0, 0, viewPort.width, viewPort.height)
        surfaceEffects.forEach(effect => drawEffect(ctx, drawingMethods, effect))
        drawLand(ctx, drawingMethods, viewPort, game.land, assets)
    }
    if (sprite_canvas) {
        const ctx = sprite_canvas.getContext('2d')
        if (!ctx) { return }
        const drawingMethods = makeDrawingMethods(ctx, viewPort)
        
        ctx.clearRect(0, 0, viewPort.width, viewPort.height)
        
        
        drawTowns(ctx, drawingMethods, towns, viewPort, game.cycleNumber, game.wind, game.invadingActions)
        drawShips(ctx, drawingMethods, viewPort, game, false)
        projectiles.forEach(projectile => drawProjectile(ctx, drawingMethods, projectile))
        effects.forEach(effect => drawEffect(ctx, drawingMethods, effect))
        invadingActions.forEach(action => drawInvadingAction(ctx, drawingMethods, action, game))
        boardingActions.forEach(action => drawBoardingAction(ctx, drawingMethods, action, game))
    }
}

