import { CSSProperties } from "react"
import { Ship } from "../game-state/ship"
import { SAIL_COLOR_CSS } from "../lib/Color"

interface Props {
    ship: Ship
    setSailLevelTarget: { (level: number): void }
}

const figureStyle = (height: number, width: number): CSSProperties => ({
    position: 'relative',
    boxSizing: 'border-box',
    width,
    height,
    borderTop: '3px solid black',
    margin: '0 auto',
})
const mastStyle = (height: number): CSSProperties => ({
    position: "absolute",
    left: 0,
    top: 0,
    height,
    width: '50%',
    borderRight: '3px solid black',
})

const sailStyle = (level: number): CSSProperties => ({
    boxSizing: 'border-box',
    width: '90%',
    margin: '0 auto',
    border: '1px solid black',
    position: 'absolute',
    top: 0,
    height: `${level * 100}%`,
    left: '5%',
    background: SAIL_COLOR_CSS,
})
const targetLineStyle = (level: number): CSSProperties => ({
    width: '100%',
    borderBottom: '3px dashed gray',
    position: 'absolute',
    top: `${level * 100}%`,
    left: 0,
    height: 0,
})

export const SailsWidget = ({ ship, setSailLevelTarget }: Props) => {

    return (
        <div className="panel-frame" style={{ position: 'relative' }}>

            <div style={{
                display: 'flex',
                height: 80,
            }}>
                <div style={{
                    flexBasis: '20px',
                    maxWidth: '20px',
                    flexGrow: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <input type="range"
                        style={{
                            width: 80,
                            transform: 'rotate(90deg)',
                        }}
                        min={0} max={1} step={.1}
                        value={ship.sailLevelTarget}
                        onChange={(e) =>
                            setSailLevelTarget(Number(e.target.value))
                        } />
                </div>
                <div style={{
                    flexGrow: 1,
                }}>
                    <figure style={figureStyle(80, 80)}>
                        <div style={mastStyle(80)}></div>
                        <div style={sailStyle(ship.sailLevel)}></div>
                        <div style={targetLineStyle(ship.sailLevelTarget)}></div>
                    </figure>
                </div>
            </div>
            <p>Speed: {ship.speedLastTurn.toFixed(2)}</p>
        </div >
    )
}