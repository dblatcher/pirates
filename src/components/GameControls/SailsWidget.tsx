import { CSSProperties, memo } from "react"
import { SAIL_COLOR_CSS } from "../../lib/Color"
import { cornerOverlay } from "../../lib/style-helpers"
import { VerticalRange } from "../VerticalRange"

interface Props {
    sailLevelTarget: number;
    speedLastTurn: number;
    sailLevel: number;
    setSailLevelTarget: { (level: number): void }
}

const figureStyle = (height: number, width: number): CSSProperties => ({
    position: 'relative',
    boxSizing: 'border-box',
    width,
    height,
    borderTop: '3px solid brown',
    margin: '0 auto',
})
const mastStyle = (height: number): CSSProperties => ({
    position: "absolute",
    left: 0,
    top: 0,
    height,
    width: '50%',
    borderRight: '3px solid brown',
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

export const SailsWidget = memo(({ sailLevelTarget, speedLastTurn, sailLevel, setSailLevelTarget }: Props) => {
    return (
        <div className="panel-frame" style={{ position: 'relative' }}>
            <div style={{
                display: 'flex',
                height: 80,
            }}>
                <VerticalRange
                    value={sailLevelTarget}
                    height={80}
                    width={20}
                    onChange={setSailLevelTarget}
                    min={0} max={1} step={.1}
                />
                <div style={{
                    flexGrow: 1,
                }}>
                    <figure style={figureStyle(80, 80)}>
                        <div style={mastStyle(80)}></div>
                        <div style={sailStyle(sailLevel)}></div>
                        <div style={targetLineStyle(sailLevelTarget)}></div>
                    </figure>
                    <div style={cornerOverlay('bottom', 'right')}>
                        Speed: {speedLastTurn.toFixed(2)}
                    </div>
                </div>
            </div>
        </div >
    )
})