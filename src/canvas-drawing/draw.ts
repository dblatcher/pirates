import { GameState, Ship } from "../game-state/types";
import { getXYVector, translate } from "../lib/geometry";


const drawShip = (ctx: CanvasRenderingContext2D, ship: Ship) => {
    const { x, y, h, width, length, sailLevel } = ship
    const fore = translate(getXYVector((length) / 2, h), { x, y })
    const back = translate(getXYVector(-length / 2, h), { x, y })
    const foreCircle = translate(getXYVector((length - width) / 2, h), { x, y })
    const backCircle = translate(getXYVector(-(length - width) / 2, h), { x, y })
    const mastTop = translate({ x, y }, { x: 25, y: -25 })

    ctx.beginPath();
    ctx.strokeStyle = 'brown'
    ctx.arc(backCircle.x, backCircle.y, width / 2, 0, Math.PI * 2)
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = 'brown'
    ctx.arc(x, y, width / 2, 0, Math.PI * 2)
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = 'red'
    ctx.arc(foreCircle.x, foreCircle.y, width / 2, 0, Math.PI * 2)
    ctx.stroke();

    ctx.beginPath()
    ctx.strokeStyle = 'black'
    ctx.moveTo(back.x, back.y)
    ctx.lineTo(fore.x, fore.y)
    ctx.stroke();

    ctx.beginPath()
    ctx.strokeStyle = 'black'
    ctx.moveTo(x, y)
    ctx.lineTo(mastTop.x, mastTop.y)
    ctx.stroke();

    if (sailLevel) {
        ctx.beginPath()
        ctx.fillStyle = 'white'
        ctx.moveTo(mastTop.x - 15, mastTop.y - 5)
        ctx.lineTo(mastTop.x + 10, mastTop.y + 5)
        ctx.lineTo(mastTop.x + 10, mastTop.y + (20*sailLevel))
        ctx.lineTo(mastTop.x - 15, mastTop.y + (30*sailLevel))
        ctx.closePath()
        ctx.fill()
    }
}

export const drawScene = (game: GameState) => (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) { return }
    const { ships } = game
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ships.forEach(ship => drawShip(ctx, ship))
}
