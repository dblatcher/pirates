import { createRef, useLayoutEffect } from "react"

interface Props {
    draw?: { (canvas: HTMLCanvasElement): void }
    width: number;
    height: number;
}

export const CanvasScreen = ({ draw, width, height }: Props) => {
    const canvasRef = createRef<HTMLCanvasElement>()
    const renderCanvas = () => {
        const element = canvasRef.current
        if (draw && element) {
            draw(element)
        }
    }

    useLayoutEffect(renderCanvas, [draw, canvasRef])

    return <div style={{
        border: '1px solid black',
        display: 'inline-block',
        backgroundColor: 'skyblue',
    }}>
        <canvas width={width} height={height} ref={canvasRef}></canvas>
    </div>
}