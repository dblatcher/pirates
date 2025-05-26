import { CSSProperties, memo } from "react";
import { SAIL_COLOR_CSS } from "../lib/Color";

interface Props {
    sailLevelTarget: number;
    sailLevel: number;
    height: number;
    width: number
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

export const SailsFigure = memo(({ sailLevelTarget, sailLevel, height, width }: Props) => {

    return (
        <figure className="sail-figure" style={figureStyle(height, width)}>
            <div className="mast" style={mastStyle(height)}></div>
            <div className="sail" style={sailStyle(sailLevel)}></div>
            <div className="target-line" style={targetLineStyle(sailLevelTarget)}></div>
        </figure>
    )
})