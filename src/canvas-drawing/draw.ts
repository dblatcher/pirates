import { GameState, ViewPort } from "../game-state/types";
import { drawBackground } from "./drawBackground";
import { drawEffect } from "./drawEffect";
import { drawLand } from "./drawLand";
import { drawProjectile } from "./drawProjectile";
import { drawShipBase, drawShipMasts } from "./drawShip";
import { drawWithOffset } from "./drawWithOffSet";


export const drawScene = (game: GameState, viewPort: ViewPort) => (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) { return }
    const drawingMethods = drawWithOffset(ctx, viewPort)
    const { ships, projectiles, effects } = game
    ctx.clearRect(0, 0, viewPort.width, viewPort.height)
    drawBackground(ctx, drawingMethods, viewPort, game.cycleNumber)
    drawLand(ctx, drawingMethods, viewPort, game.land)
    ships.forEach(ship => drawShipBase(ctx, drawingMethods, ship))

    ships.forEach(ship => {
        drawShipMasts([
            { position: -1 / 5, height: 1.5 },
            { position: 1 / 4, height: 1 },
        ], ctx, drawingMethods, ship)
    })

    projectiles.forEach(projectile => drawProjectile(ctx, drawingMethods, projectile))
    effects.forEach(effect => drawEffect(ctx, drawingMethods, effect))
}

