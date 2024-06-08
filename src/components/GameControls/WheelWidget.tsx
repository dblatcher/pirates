import { CSSProperties, useState, } from "react"

interface Props {
    playerWheel: number
    setWheelTo: { (value: number): void }
    wheelNotLockedByPointerRef: React.MutableRefObject<boolean>
}


const wheelFrameStyle = (size: number): CSSProperties => ({
    width: size + 20,
    height: size,
})
const wheelStyle = (angle: number, size: number): CSSProperties => ({
    transform: `translateX(-50%) translateY(-50%) rotate(${angle}deg)`,
    width: size,
    height: size,
    fontSize: size,
})


export const WheelWidget = ({ playerWheel: actualWheel, setWheelTo, wheelNotLockedByPointerRef }: Props) => {
    const [locked, setLocked] = useState(false)
    const [userIsTurningWheel, setUserIsTurningWheel] = useState(false)
    const wheelAngle = -(actualWheel * 180)

    return (
        <div className="panel-frame wheel-widget-panel">
            <figure className="wheel-frame" style={wheelFrameStyle(80)}>
                <div className="wheel" style={wheelStyle(wheelAngle, 100)}>
                    <span className="no-select-highlight">☸</span>
                </div>
            </figure>
            <div className="range-wrapper">
                <input type="range"
                    className="range-control"
                    onPointerDown={() => {
                        setUserIsTurningWheel(true)
                        wheelNotLockedByPointerRef.current = false
                    }}
                    onPointerUp={() => {
                        setUserIsTurningWheel(false)
                        wheelNotLockedByPointerRef.current = !locked
                    }}
                    max={50} min={-50} step={'any'}
                    value={actualWheel * -100}
                    onChange={e => {
                        const value = Number(e.target.value)
                        if (isNaN(value)) { return }
                        setWheelTo(value * (-1 / 100))
                    }} />
            </div>
            <div className="locked-wrapper">
                <input type="checkbox" checked={locked} onChange={e => {
                    setLocked(e.target.checked)
                    if (e.target.checked) {
                        wheelNotLockedByPointerRef.current = false
                    } else {
                        wheelNotLockedByPointerRef.current = !userIsTurningWheel
                    }
                }} />
            </div>
        </div>
    )
}