import { DragState } from "@use-gesture/react"
import { CSSProperties, FunctionComponent, MutableRefObject } from "react"
import { GameState } from "../game-state"
import { XY } from "../lib/geometry"


type Props = {
    touch?: DragState
    locate: { (state: DragState): { initial: XY, current: XY } }
    gameStateRef: MutableRefObject<GameState>
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

export const TouchIndicator: FunctionComponent<Props> = ({ touch, locate, gameStateRef }) => {

    if (!touch || touch.elapsedTime < 250) {
        return null
    }
    const { initial } = locate(touch)
    const playerWheel = gameStateRef.current.ships.find(ship => ship.id === gameStateRef.current.playerId)?.wheel ?? 0
    const wheelAngle = -(playerWheel * 180)

    return (
        <>
            <div style={{
                position: 'absolute',
                left: initial.x,
                top: initial.y,
                transform: 'translateX(-50%)',
                opacity: .75
            }}
                className="wheel-widget-panel"
            >
                <figure className="wheel-frame" style={wheelFrameStyle(60)}>
                    <div className="wheel" style={wheelStyle(wheelAngle, 60)}>
                        <span className="no-select-highlight">☸</span>
                    </div>
                </figure>
            </div>
        </>
    )
}
