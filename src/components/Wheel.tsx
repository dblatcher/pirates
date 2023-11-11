import { CSSProperties, useState, useCallback } from "react"
import { useInterval } from "../lib/useInterval"

interface Props {
    playerWheel: number
    setPlayerWheel: { (value: number): void }
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


export const Wheel = ({ playerWheel, setPlayerWheel }: Props) => {
    const [locked, setLocked] = useState(false)
    const [pointerOnInput, setPointerOnInput] = useState(false)

    // TO DO - getting some slowdown with this - 
    // changes the parent state on an interval is not good
    // doesn't work if change the interval 
    const wheelAngle = -(playerWheel * 180)
    const revertToCentre = useCallback(() => {
        if (locked || pointerOnInput || playerWheel === 0) {
            return
        }
        const changeAmount = Math.min(Math.abs(playerWheel), .01)
        setPlayerWheel(playerWheel - changeAmount * Math.sign(playerWheel))
    }, [locked, pointerOnInput, playerWheel, setPlayerWheel]
    )
    useInterval(revertToCentre, 20)

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
                    value={playerWheel * -100}
                    onChange={e => {
                        const value = Number(e.target.value)
                        if (isNaN(value)) { return }
                        setPlayerWheel(value * (-1 / 100))
                    }} />
            </div>
        </div>
    )
}