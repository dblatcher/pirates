import { CSSProperties, useState, } from "react"
import { Directive, Order } from "../game-state"
import { useInterval } from "../hooks/useInterval"

interface Props {
    addDirective: { (directive: Directive): void }
    playerWheel: number
    setWheelTo: { (value: number): void }
}


const wheelFrameStyle = (size: number): CSSProperties => ({
    position: "relative",
    border: '1px solid black',
    width: size,
    height: size,
    margin: '0px auto',
    overflow: "hidden",
})
const wheelStyle = (angle: number, color: string, size: number): CSSProperties => ({
    position: "absolute",
    borderTop: `2px dashed ${color}`,
    borderRadius: '25%',

    left: '50%',
    top: '50%',

    width: size,
    height: size,
    transform: `translateX(-50%) translateY(-50%) rotate(${angle}deg)`,
    transition: 'transform .2s',
    boxSizing: "border-box",
    display: 'flex',
    justifyContent: 'center',

    color: color,
    textShadow: '2px 2px black',
    alignItems: 'center',
    fontSize: size,
    lineHeight: 0,
})


export const WheelWidget = ({ addDirective, playerWheel: actualWheel, setWheelTo }: Props) => {
    const [locked, setLocked] = useState(false)
    const [pointerOnInput, setPointerOnInput] = useState(false)

    const addWheelDirective = (value: number) => {
        addDirective({ order: Order.WHEEL_TO, quantity: value })
    }

    const revertToCentre = () => {
        if (locked || pointerOnInput || actualWheel === 0) {
            return
        }
        const changeAmount = Math.min(Math.abs(actualWheel), .01)
        addWheelDirective(actualWheel - changeAmount * Math.sign(actualWheel))
    }

    useInterval(revertToCentre, 10)

    const wheelAngle = -(actualWheel * 180)
    return (
        <div className="panel-frame" style={{ width: 120, position: 'relative' }}>
            <figure style={wheelFrameStyle(80)}>
                <div style={wheelStyle(wheelAngle, 'saddlebrown', 70)}>
                    <span>☸</span>
                </div>
            </figure>
            <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
            }}>
                <input type="checkbox" checked={locked} onChange={e => setLocked(e.target.checked)} />
            </div>
            <div>
                <input type="range"
                    onPointerDown={() => {
                        setPointerOnInput(true)
                    }}
                    onPointerUp={() => {
                        setPointerOnInput(false)
                    }}
                    style={{ width: '100%' }}
                    max={50} min={-50} step={'any'}
                    value={actualWheel * -100}
                    onChange={e => {
                        const value = Number(e.target.value)
                        if (isNaN(value)) { return }
                        setWheelTo(value * (-1 / 100))
                    }} />
            </div>
        </div>
    )
}