import { createRef, useLayoutEffect } from "react"
import { drawScene } from "../canvas-drawing/draw"
import { useAssets } from "../context/asset-context"
import { GameState, ViewPort } from "../game-state"
import { SEA_COLOR_CSS } from "../lib/Color"

interface Props {
    gameState: GameState
    viewPort: ViewPort
    magnify?: number
}

export const GameScreen = ({ gameState, viewPort, magnify = 1 }: Props) => {

    const assets = useAssets()
    const backgroundCanvasRef = createRef<HTMLCanvasElement>()
    const spriteCanvasRef = createRef<HTMLCanvasElement>()

    const renderCanvas = () => {
        assets
            ? drawScene(gameState, viewPort, assets)([backgroundCanvasRef.current, spriteCanvasRef.current])
            : undefined
    }

    useLayoutEffect(renderCanvas, [renderCanvas, backgroundCanvasRef, spriteCanvasRef])

    if (!assets) {
        return <div>FAILED TO LOAD ASSETS</div>
    }

    return (
        <div style={{
            display: 'flex',
            position: 'relative',
            width: viewPort.width * magnify,
            height: viewPort.height * magnify,
            overflow: 'hidden'
        }}>
            <canvas style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                backgroundColor: SEA_COLOR_CSS,
            }} width={viewPort.width} height={viewPort.height} ref={backgroundCanvasRef}></canvas>
            <canvas style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
            }} width={viewPort.width} height={viewPort.height} ref={spriteCanvasRef} ></canvas>
        </div>
    )
}