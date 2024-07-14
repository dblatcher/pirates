import { createRef, useEffect, useLayoutEffect, useState } from "react"
import { drawScene, drawSea, drawnTerrainOffScreen } from "../canvas-drawing/draw"
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
    const spriteCanvasRef = createRef<HTMLCanvasElement>()
    const [terrainImage, setTerrainImage] = useState<string | undefined>(undefined)

    useEffect(() => {
        if (assets) {
            const url = drawnTerrainOffScreen(gameState, assets)
            setTerrainImage(url)
        }
    }, [assets])

    const renderCanvas = () => {
        if (!assets) {
            return
        }
        drawSea(gameState, viewPort, assets)(seaCanvasRef.current)
        drawScene(gameState, viewPort, assets)(spriteCanvasRef.current)
    }

    useLayoutEffect(renderCanvas, [renderCanvas, spriteCanvasRef])

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
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: `${100 * xR}%`,
                    height: `${100 * yR}%`,
                    transform: `translatex(${-viewPort.x * magnify}px) translatey(${-viewPort.y * magnify}px)`,
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: `${100}%`,
                        height: `${100}%`,
                        backgroundImage: terrainImage ? `url("${terrainImage}")` : undefined,
                        backgroundSize: ` ${100}% ${100}%`,
                    }}
                ></div>
            </div>
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