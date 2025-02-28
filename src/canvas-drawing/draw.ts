import { makeDrawingMethods, drawSpriteFunc, drawOffScreen, DrawToCanvasFunction, GenerateImageUrl } from "@dblatcher/sprite-canvas";
import { GameState, TERRAIN_SQUARE_SIZE, TOWN_SIZE, ViewPort } from "../game-state";
import { drawEffect } from "./drawEffect";
import { drawBoardingAction, drawInvadingAction } from "./drawAction";
import { drawLand } from "./drawLand";
import { drawProjectile } from "./drawProjectile";
import { drawShips } from "./ships";
import { drawTowns } from "./towns";
import { AssetMap } from "../context/asset-context";
import { AssetKey, assetParams } from "../assets";


export const drawSea = (game: GameState, viewPort: ViewPort) => (canvas: (HTMLCanvasElement | null)) => {
    const { surfaceEffects } = game
    if (canvas) {
        const ctx = canvas.getContext('2d')
        if (!ctx) { return }
        const drawingMethods = makeDrawingMethods(ctx, viewPort)
        ctx.clearRect(0, 0, viewPort.width, viewPort.height)
        surfaceEffects.forEach(effect => drawEffect(ctx, drawingMethods, effect))
    }
}

const drawTerrain: DrawToCanvasFunction<GameState, AssetKey> = (game: GameState, assets: AssetMap) => (canvas: (HTMLCanvasElement | null)) => {
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
        const drawSprite = drawSpriteFunc(drawingMethods, assets, assetParams, TERRAIN_SQUARE_SIZE, TERRAIN_SQUARE_SIZE)
        drawLand(ctx, drawingMethods, fullViewport, game.land, assets, drawSprite)

        const imageSize = TOWN_SIZE * .8
        game.towns.forEach(town => {
            drawSprite({
                key: 'MISC',
                x: town.x,
                y: town.y - imageSize * .1,
                fx: 1, fy: 3,
                width: imageSize, height: imageSize,
                center: true,
            })
        })
    }
}
export const drawnTerrainOffScreen: GenerateImageUrl<GameState, AssetKey> = (game: GameState, assets: AssetMap) => drawOffScreen(drawTerrain)(game, assets)


export const drawScene = (game: GameState, viewPort: ViewPort, assets: AssetMap) => (sprite_canvas: (HTMLCanvasElement | null)) => {
    const { projectiles, effects, towns, invadingActions, boardingActions } = game
    if (sprite_canvas) {
        const ctx = sprite_canvas.getContext('2d')
        if (!ctx) { return }
        const drawingMethods = makeDrawingMethods(ctx, viewPort)
        const drawSprite = drawSpriteFunc(drawingMethods, assets, assetParams, TERRAIN_SQUARE_SIZE, TERRAIN_SQUARE_SIZE);
        ctx.clearRect(0, 0, viewPort.width, viewPort.height)
        drawTowns(ctx, drawingMethods, towns, viewPort, game.cycleNumber, game.wind, game.invadingActions)
        drawShips(ctx, drawingMethods, drawSprite, viewPort, game, false)
        projectiles.forEach(projectile => drawProjectile(ctx, drawingMethods, projectile))
        effects.forEach(effect => drawEffect(ctx, drawingMethods, effect))
        invadingActions.forEach(action => drawInvadingAction(ctx, drawingMethods, drawSprite, action, game))
        boardingActions.forEach(action => drawBoardingAction(ctx, drawingMethods, drawSprite, action, game))
    }
}

