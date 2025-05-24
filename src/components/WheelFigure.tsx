import { CSSProperties, FunctionComponent } from "react"


type Props = {
    playerWheel: number;
    size: number;
    frameSize?: number;
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

export const WheelFigure: FunctionComponent<Props> = ({ playerWheel, size, frameSize }) => {
    const wheelAngle = -(playerWheel * 180);

    return (
        <figure className="wheel-frame" style={wheelFrameStyle(frameSize ?? size)}>
            <div className="wheel" style={wheelStyle(wheelAngle, size)}>
                <span className="no-select-highlight">☸</span>
            </div>
        </figure>
    )
}
