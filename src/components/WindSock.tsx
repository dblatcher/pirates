import { CSSProperties } from "react"
import { MAX_WIND, Wind } from "../game-state"
import { _360_DEG, _DEG, getXYVector } from "typed-geometry"
import { CanvasScreen } from "./CanvasScreen"
import { colors, rgb, rgba } from "../lib/Color"

interface Props {
    wind: Wind
}


const figureStyle: CSSProperties = {
    margin: 0,
    padding: 5,
    position: 'relative',
}

const northStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: 'fantasy, sans-serif',
    fontSize: 'x-large',
    color: rgb(colors.RED),
    textShadow: `1px 1px ${rgb(colors.BLACK)}, -1px -1px ${rgb(colors.BLACK)}`,  
}

const drawMeterFunction = (wind: Wind) => (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) { return }
    ctx.beginPath()
    ctx.lineWidth = 2
    ctx.strokeStyle = rgb(colors.RED)
    ctx.setLineDash([1, 2])
    ctx.clearRect(0, 0, 100, 100)
    ctx.arc(50, 50, 50, 0, _360_DEG)
    ctx.moveTo(90, 50)
    ctx.arc(50, 50, 40, 0, _360_DEG)
    ctx.moveTo(80, 50)
    ctx.arc(50, 50, 30, 0, _360_DEG)
    ctx.moveTo(70, 50)
    ctx.arc(50, 50, 20, 0, _360_DEG)
    ctx.moveTo(60, 50)
    ctx.arc(50, 50, 10, 0, _360_DEG)
    ctx.stroke()

    ctx.beginPath()
    ctx.lineWidth = 2
    ctx.strokeStyle = rgb(colors.RED)
    ctx.fillStyle = rgba(colors.BLACK, .75)
    const coneLeft = getXYVector((wind.force / MAX_WIND) * 50, wind.direction - _DEG * 10)
    const coneRight = getXYVector((wind.force / MAX_WIND) * 50, wind.direction + _DEG * 10)
    ctx.lineWidth = 3
    ctx.setLineDash([])
    ctx.moveTo(50, 50)
    ctx.lineTo(50 + coneLeft.x, 50 + coneLeft.y)
    ctx.lineTo(50 + coneRight.x, 50 + coneRight.y)
    ctx.lineTo(50, 50)
    ctx.fill()
    ctx.stroke()
}

export const WindSock = ({ wind }: Props) => {
    return (
        <figure style={figureStyle}>
            <span style={northStyle}>N</span>
            <CanvasScreen width={100} height={100}
                draw={drawMeterFunction(wind)}
            />
        </figure>
    )
}