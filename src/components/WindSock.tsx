import { MAX_WIND, Wind } from "../game-state/types"
import { _360_DEG, _DEG, getXYVector } from "../lib/geometry"
import { CanvasScreen } from "./CanvasScreen"

interface Props {
    wind: Wind
}

export const WindSock = ({ wind }: Props) => {

    const drawMeter = (canvas: HTMLCanvasElement) => {
        const ctx = canvas.getContext('2d')
        if (!ctx) { return }
        ctx.beginPath()
        ctx.lineWidth = 1
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
        const coneLeft = getXYVector((wind.force / MAX_WIND) * 50, wind.direction - _DEG * 10)
        const coneRight = getXYVector((wind.force / MAX_WIND) * 50, wind.direction + _DEG * 10)
        ctx.lineWidth = 3
        ctx.setLineDash([])
        ctx.moveTo(50, 50)
        ctx.lineTo(50 + coneLeft.x, 50 + coneLeft.y)
        ctx.lineTo(50 + coneRight.x, 50 + coneRight.y)
        ctx.lineTo(50, 50)
        ctx.stroke()
    }

    return (
        <div className="panel-frame">
            <CanvasScreen width={100} height={100}
                draw={drawMeter}
            />
        </div>
    )
}