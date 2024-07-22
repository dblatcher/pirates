import { GameState, TOWN_SIZE, ViewPort } from "../game-state";
import { drawEffect } from "./drawEffect";
import { drawBoardingAction, drawInvadingAction } from "./drawAction";
import { drawLand } from "./drawLand";
import { drawProjectile } from "./drawProjectile";
import { makeDrawingMethods } from "./drawWithOffSet";
import { drawShips } from "./ships";
import { drawTowns } from "./towns";
import { AssetMap } from "../context/asset-context";
import { drawSpriteFunc } from "./draw-sprite";


export const drawSea = (game: GameState, viewPort: ViewPort, _assets: AssetMap) => (canvas: (HTMLCanvasElement | null)) => {
    const { surfaceEffects } = game
    if (canvas) {
        const ctx = canvas.getContext('2d')
        if (!ctx) { return }
        const drawingMethods = makeDrawingMethods(ctx, viewPort)
        ctx.clearRect(0, 0, viewPort.width, viewPort.height)
        surfaceEffects.forEach(effect => drawEffect(ctx, drawingMethods, effect))
    }
}

export const drawTerrain = (game: GameState, _viewPort: ViewPort, assets: AssetMap) => (canvas: (HTMLCanvasElement | null)) => {
    if (canvas) {
        const ctx = canvas.getContext('2d')

        if (!ctx) { return }
        const fullViewport: ViewPort = {
            x: 0,
            y: 0,
            height: game.mapHeight,
            width: game.mapWidth,
        }
        const drawingMethods = makeDrawingMethods(ctx, fullViewport)
        ctx.clearRect(0, 0, fullViewport.width, fullViewport.height)
        drawLand(ctx, drawingMethods, fullViewport, game.land, assets)

        const imageSize = TOWN_SIZE * 1

        const drawSprite = drawSpriteFunc(drawingMethods, assets)

        game.towns.forEach(town => {
            drawSprite({
                key: 'MISC',
                x: town.x - imageSize / 2,
                y: town.y - imageSize / 2,
                fx: 1, fy: 3,
                width: imageSize, height: imageSize
            })
        })
    }
}

export const drawnTerrainOffScreen = (game: GameState, assets: AssetMap) => {
    const canvas = document.createElement('canvas')
    canvas.width = game.mapWidth
    canvas.height = game.mapHeight
    drawTerrain(game, {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    }, assets)(canvas)

    return (canvas.toDataURL())
}


export const drawScene = (game: GameState, viewPort: ViewPort, assets: AssetMap) => (sprite_canvas: (HTMLCanvasElement | null)) => {
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
        invadingActions.forEach(action => drawInvadingAction(ctx, drawingMethods, assets, action, game))
        boardingActions.forEach(action => drawBoardingAction(ctx, drawingMethods, assets, action, game))
    }
}

