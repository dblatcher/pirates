import { CSSProperties, createRef, useLayoutEffect } from "react"

interface Props {
    draw?: { (canvas: HTMLCanvasElement): void }
    width: number;
    height: number;
    containerStyle?: CSSProperties;
    canvasStyle?: CSSProperties;
}

export const CanvasScreen = ({ draw, width, height, containerStyle, canvasStyle }: Props) => {
    const canvasRef = createRef<HTMLCanvasElement>()
    const renderCanvas = () => {
        const element = canvasRef.current
        if (draw && element) {
            draw(element)
        }
    }

    useLayoutEffect(renderCanvas, [draw, canvasRef])

    return <div style={containerStyle}>
        <canvas style={canvasStyle} width={width} height={height} ref={canvasRef}></canvas>
    </div>
}