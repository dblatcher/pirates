import { GameState } from "../game-state/types";

export const testDraw = (game: GameState) => (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) { return }

    const { x, y } = game

    ctx.clearRect(0, 0, 200, 200)
    ctx.beginPath();
    ctx.strokeStyle = "red"
    ctx.arc(x, y, 5, 0, Math.PI*2)
    ctx.stroke()
}
