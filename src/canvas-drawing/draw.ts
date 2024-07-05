import { GameState, ViewPort } from "../game-state";
import { drawEffect } from "./drawEffect";
import { drawBoardingAction, drawInvadingAction } from "./drawAction";
import { drawLand } from "./drawLand";
import { drawProjectile } from "./drawProjectile";
import { makeDrawingMethods } from "./drawWithOffSet";
import { drawShips } from "./ships";
import { drawTowns } from "./towns";
import { AssetMap } from "../context/asset-context";


export const drawBackground = (game: GameState, viewPort: ViewPort, assets: AssetMap) => (canvas: (HTMLCanvasElement | null)) => {

    const { surfaceEffects } = game

    if (canvas) {
        const ctx = canvas.getContext('2d')
        if (!ctx) { return }
        const doubleViewport: ViewPort = {
            x: viewPort.x,
            y: viewPort.y,
            height: viewPort.height,
            width: viewPort.width
        }
        const drawingMethods = makeDrawingMethods(ctx, doubleViewport)
        ctx.clearRect(0, 0, doubleViewport.width, doubleViewport.height)
        surfaceEffects.forEach(effect => drawEffect(ctx, drawingMethods, effect))
        drawLand(ctx, drawingMethods, doubleViewport, game.land, assets)
    }
}


export const drawScene = (game: GameState, viewPort: ViewPort, _assets: AssetMap) => (sprite_canvas: (HTMLCanvasElement | null)) => {
    const { projectiles, effects, towns, invadingActions, boardingActions } = game
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

