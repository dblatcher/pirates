import { drawScene } from "../canvas-drawing/draw"
import { GameState, ViewPort } from "../game-state/types"
import { CanvasScreen } from "./CanvasScreen"

interface Props {
    gameState: GameState
    viewPort: ViewPort
    magnify?: number
}

export const GameScreen = ({ gameState, viewPort, magnify = 1 }: Props) => {

    return <CanvasScreen
        containerStyle={{
            border: '1px solid black',
            display: 'inline-block',
        }}
        canvasStyle={{
            width: viewPort.width * magnify,
            height: viewPort.height * magnify,
            backgroundColor: 'skyblue',
        }}
        draw={drawScene(gameState, viewPort)}
        width={viewPort.width}
        height={viewPort.height} />
}