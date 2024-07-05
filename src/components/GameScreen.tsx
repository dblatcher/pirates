import { drawScene } from "../canvas-drawing/draw"
import { useAssets } from "../context/asset-context"
import { GameState, ViewPort } from "../game-state"
import { SEA_COLOR_CSS } from "../lib/Color"
import { CanvasScreen } from "./CanvasScreen"
import { LayeredCanvasScreen } from "./LayeredCanvasScreen"

interface Props {
    gameState: GameState
    viewPort: ViewPort
    magnify?: number
}

export const GameScreen = ({ gameState, viewPort, magnify = 1 }: Props) => {

    const assets = useAssets()

    if (!assets) {
        return <div>FAILED TO LOAD ASSETS</div>
    }

    return <LayeredCanvasScreen
        containerStyle={{
            display: 'flex',
            width: viewPort.width * magnify,
            height: viewPort.height * magnify,
        }}
        canvasStyle={[
            {
                backgroundColor: SEA_COLOR_CSS,
            },
            {
            },
        ]}
        draw={drawScene(gameState, viewPort, assets)}
        width={viewPort.width}
        height={viewPort.height} />
}