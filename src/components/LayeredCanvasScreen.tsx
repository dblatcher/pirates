import { CSSProperties, createRef, useLayoutEffect } from "react"

interface Props {
    draw?: { (canvases: Array<HTMLCanvasElement | null>): void }
    width: number;
    height: number;
    containerStyle?: CSSProperties;
    containerClassName?: string;
    canvasStyle?: CSSProperties[];
}

export const LayeredCanvasScreen = ({ draw, width, height, containerStyle, canvasStyle = [], containerClassName }: Props) => {
    const canvasRefs = [
        createRef<HTMLCanvasElement>(),
        createRef<HTMLCanvasElement>(),
    ]
    const renderCanvas = () => {

        if (draw) {
            draw(canvasRefs.map(ref => ref.current))
        }
    }

    useLayoutEffect(renderCanvas, [draw, canvasRefs.map(ref => ref.current)])

    return <div style={containerStyle} className={containerClassName}>
        {canvasRefs.map((ref, index) => (
            <canvas style={{
                position: 'absolute',
                inset: 0,
                width:'100%',
                height:'100%',
                ...(canvasStyle[index] || {})
            }} width={width} height={height} ref={ref}></canvas>
        ))}
    </div>
}