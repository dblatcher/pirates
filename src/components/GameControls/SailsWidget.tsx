import { CSSProperties, memo, useCallback } from "react"
import { SAIL_COLOR_CSS } from "../../lib/Color"
import { VerticalRange } from "../VerticalRange"
import { useControls } from "../../context/control-context";
import { Order } from "../../game-state";

interface Props {
    sailLevelTarget: number;
    sailLevel: number;
}

const figureStyle = (height: number, width: number): CSSProperties => ({
    width,
    height,
})
const mastStyle = (height: number): CSSProperties => ({
    height,
})
const sailStyle = (level: number): CSSProperties => ({
    height: `${level * 100}%`,
    background: SAIL_COLOR_CSS,
})
const targetLineStyle = (level: number): CSSProperties => ({
    top: `${level * 100}%`,
})

export const SailsWidget = memo(({ sailLevelTarget, sailLevel }: Props) => {
    const { center } = useControls()
    const setSailLevelTarget = useCallback((quantity: number) => {
        center.sendDirective({ order: Order.SAILS_TO, quantity })
    }, [center])

    return (
        <div className="panel-frame sail-widget-panel">
            <div className="sail-wrapper">
                <VerticalRange
                    value={sailLevelTarget}
                    height={80}
                    width={20}
                    onChange={setSailLevelTarget}
                    min={0} max={1} step={.1}
                />
                <div style={{ flexGrow: 1, }}>
                    <figure className="sail-figure" style={figureStyle(80, 80)}>
                        <div className="mast" style={mastStyle(80)}></div>
                        <div className="sail" style={sailStyle(sailLevel)}></div>
                        <div className="target-line" style={targetLineStyle(sailLevelTarget)}></div>
                    </figure>
                </div>
            </div>
        </div >
    )
})