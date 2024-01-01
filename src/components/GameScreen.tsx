import { drawScene } from "../canvas-drawing/draw"
import { GameState, ViewPort } from "../game-state"
import { SEA_COLOR_CSS } from "../lib/Color"
import { CanvasScreen } from "./CanvasScreen"

interface Props {
    gameState: GameState
    viewPort: ViewPort
    magnify?: number
}

export const GameScreen = ({ gameState, viewPort, magnify = 1 }: Props) => {

    return <CanvasScreen
        containerStyle={{
            display: 'flex',
        }}
        canvasStyle={{
            width: viewPort.width * magnify,
            height: viewPort.height * magnify,
            backgroundColor: SEA_COLOR_CSS,
        }}
        draw={drawScene(gameState, viewPort)}
        width={viewPort.width}
        height={viewPort.height} />
}