import { createRef, useEffect, useLayoutEffect } from "react"
import { drawTerrain, drawScene, drawSea } from "../canvas-drawing/draw"
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
    const seaCanvasRef = createRef<HTMLCanvasElement>()
    const backgroundCanvasRef = createRef<HTMLCanvasElement>()
    const spriteCanvasRef = createRef<HTMLCanvasElement>()

    useEffect(() => {
        if (assets) {
            drawTerrain(gameState, viewPort, assets)(backgroundCanvasRef.current)
        }
    }, [assets, backgroundCanvasRef.current])

    const renderCanvas = () => {
        if (!assets) {
            return
        }
        drawSea(gameState, viewPort, assets)(seaCanvasRef.current)
        drawScene(gameState, viewPort, assets)(spriteCanvasRef.current)
    }

    useLayoutEffect(renderCanvas, [renderCanvas, backgroundCanvasRef, spriteCanvasRef])

    if (!assets) {
        return <div>FAILED TO LOAD ASSETS</div>
    }

    const xR = gameState.mapWidth / viewPort.width
    const yR = gameState.mapHeight / viewPort.height

    return (
        <div style={{
            display: 'flex',
            position: 'relative',
            width: viewPort.width * magnify,
            height: viewPort.height * magnify,
            overflow: 'hidden'
        }}>
            <canvas
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: SEA_COLOR_CSS,
                }}
                width={viewPort.width}
                height={viewPort.height}
                ref={seaCanvasRef} ></canvas>
            <canvas
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: `${100 * xR}%`,
                    height: `${100 * yR}%`,
                    transform: `translatex(${-viewPort.x * magnify}px) translatey(${-viewPort.y * magnify}px)`,
                }}
                width={gameState.mapWidth}
                height={gameState.mapHeight}
                ref={backgroundCanvasRef}></canvas>
            <canvas
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                }}
                width={viewPort.width}
                height={viewPort.height}
                ref={spriteCanvasRef} ></canvas>
        </div>
    )
}