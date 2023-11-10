import { CSSProperties, useState } from "react"
import { useInterval } from "../lib/useInterval"

interface Props {
    playerWheel: number
    setPlayerWheel: { (value: number): void }
    actual: number
}



const wheelFrameStyle = (): CSSProperties => ({
    position: "relative",
    border: '1px solid black',
    width: 75,
    height: 75,
    margin: 0,
    overflow: "hidden",
})
const wheelStyle = (angle: number, color: string): CSSProperties => ({
    position: "absolute",
    borderLeft: `5px inset ${color}`,
    borderTop: `5px inset ${color}`,

    left: '50%',
    top: '50%',

    width: 60,
    height: 60,
    transform: `translateX(-50%) translateY(-50%) rotate(${angle}deg)`,
    transition: 'transform .2s',
    boxSizing: "border-box",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
})



export const Wheel = ({ playerWheel, setPlayerWheel, actual }: Props) => {

    const [locked, setLocked] = useState(false)
    const wheelAngle = 45 - (playerWheel * 180)
    const actualWheelAngle = 45 - (actual * 180)

    const revertToCentre = () => {
        if (locked) {
            return
        }
        if (playerWheel === 0) {
            return
        }
        const changeAmount = Math.min(Math.abs(playerWheel), .005)
        setPlayerWheel(playerWheel - changeAmount * Math.sign(playerWheel))
    }

    useInterval(revertToCentre, 10)

    return (
        <div className="panel-frame">

            <figure style={wheelFrameStyle()}>
                <div style={wheelStyle(actualWheelAngle, 'gray')}>
                    <span style={{
                        fontSize: '70px',
                        lineHeight: 0,
                        transform: 'rotate(-45deg)'
                    }}>☸</span>
                </div>
                <div style={wheelStyle(wheelAngle, 'red')}></div>
            </figure>

            <div>
                {locked ? 'L' : 'N'}
                <input type="checkbox" checked={locked} onChange={e => setLocked(e.target.checked)} />
                <span>{playerWheel.toFixed(2)}</span>
            </div>
            <div>
                <button onClick={() => { setPlayerWheel(.5) }}>.5</button>
                <button onClick={() => { setPlayerWheel(.25) }}>.25</button>
                <button onClick={() => { setPlayerWheel(.1) }}>.1</button>
                <button onClick={() => { setPlayerWheel(0) }}>0</button>
                <button onClick={() => { setPlayerWheel(-.1) }}>-.1</button>
                <button onClick={() => { setPlayerWheel(-.25) }}>-.25</button>
                <button onClick={() => { setPlayerWheel(-.5) }}>-.5</button>
            </div>
            <div>
                <input type="range"
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