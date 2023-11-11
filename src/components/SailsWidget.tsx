import { CSSProperties } from "react"
import { Ship } from "../game-state/ship"

interface Props {
    ship: Ship
    setSailLevelTarget: { (level: number): void }
}

const figureStyle = (height: number): CSSProperties => ({
    position: 'relative',
    borderTop: '3px solid black',
    height,
    boxSizing: 'border-box',
    marginBottom: 10,
    width:'50%',
})
const mastStyle = (height: number): CSSProperties => ({
    position:"absolute",
    left:0,
    top:0,
    height,
    width:'50%',
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
    background: 'rgba(255,255,255,0.8)',
})
const targetLineStyle = (level: number): CSSProperties => ({
    width: '100%',
    borderTop: '3px dashed gray',
    position: 'absolute',
    top: `${level * 100}%`,
    left: 0,
    height: 0,
})

export const SailsWidget = ({ ship, setSailLevelTarget }: Props) => {

    return (
        <div className="panel-frame">
            <figure style={figureStyle(50)}>
                <div style={mastStyle(50)}></div>
                <div style={sailStyle(ship.sailLevel)}></div>
                <div style={targetLineStyle(ship.sailLevelTarget)}></div>
            </figure>
            <button onClick={() => setSailLevelTarget(0)}>none</button>
            <button onClick={() => setSailLevelTarget(.5)}>half</button>
            <button onClick={() => setSailLevelTarget(1)}>full</button>
        </div>
    )
}