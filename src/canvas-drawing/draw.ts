import { GameState, Ship } from "../game-state/types";
import { getXYVector, translate } from "../lib/geometry";


const drawShip = (ctx: CanvasRenderingContext2D, ship: Ship) => {
    const { x, y, h, width, length } = ship
    const fore = translate(getXYVector((length) / 2, h), { x, y })
    const back = translate(getXYVector(-length / 2, h), { x, y })
    
    const foreCircle = translate(getXYVector((length - width) / 2, h), { x, y })
    const backCircle = translate(getXYVector(-(length-width) / 2, h), { x, y })


    ctx.beginPath();
    ctx.arc(backCircle.x, backCircle.y, width / 2, 0, Math.PI * 2)
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, width / 2, 0, Math.PI * 2)
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(foreCircle.x, foreCircle.y, width / 2, 0, Math.PI * 2)
    ctx.stroke();

    ctx.beginPath()
    ctx.moveTo(back.x, back.y)
    ctx.lineTo(fore.x, fore.y)
    ctx.stroke();
}

export const drawScene = (game: GameState) => (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) { return }
    const { ships } = game
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ships.forEach(ship => drawShip(ctx, ship))
}
