import { useState } from "react"
import { useControls } from "../../context/control-context"
import { WheelFigure } from "../WheelFigure"

interface Props {
    playerWheel: number
}

export const WheelWidget = ({ playerWheel }: Props) => {
    const { center } = useControls()
    const [locked, setLocked] = useState(false)
    const [userIsTurningWheel, setUserIsTurningWheel] = useState(false)

    return (
        <div className="panel-frame wheel-widget-panel">
            <WheelFigure size={100} frameSize={80} playerWheel={playerWheel} />
            <div className="range-wrapper">
                <input type="range"
                    className="range-control"
                    onPointerDown={() => {
                        setUserIsTurningWheel(true)
                        center.wheelFreeFromPointer.current = false
                    }}
                    onPointerUp={() => {
                        setUserIsTurningWheel(false)
                        center.wheelFreeFromPointer.current = !locked
                    }}
                    max={50} min={-50} step={'any'}
                    value={playerWheel * -100}
                    onChange={e => {
                        const value = Number(e.target.value)
                        if (isNaN(value)) { return }
                        center.sendWheelValue(value * (-1 / 100))
                    }} />
            </div>
            <div className="locked-wrapper">
                <input type="checkbox" checked={locked} onChange={e => {
                    setLocked(e.target.checked)
                    if (e.target.checked) {
                        center.wheelFreeFromPointer.current = false
                    } else {
                        center.wheelFreeFromPointer.current = !userIsTurningWheel
                    }
                }} />
            </div>
        </div>
    )
}