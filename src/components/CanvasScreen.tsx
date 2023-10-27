import { createRef, useLayoutEffect } from "react"

interface Props {
    draw?: { (canvas: HTMLCanvasElement): void }
}

export const CanvasScreen = ({ draw }: Props) => {
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
        display: 'inline-block'
    }}>
        <canvas width={500} height={500} ref={canvasRef}></canvas>
    </div>
}