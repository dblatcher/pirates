import { DragState } from "@use-gesture/react"
import { FunctionComponent, MutableRefObject } from "react"
import { GameState } from "../game-state"
import { XY } from "../lib/geometry"
import { WheelFigure } from "./WheelFigure"


type Props = {
    touch?: DragState
    locate: { (state: DragState): { initial: XY, current: XY } }
    gameStateRef: MutableRefObject<GameState>
}


export const TouchIndicator: FunctionComponent<Props> = ({ touch, locate, gameStateRef }) => {

    if (!touch || touch.elapsedTime < 100) {
        return null
    }
    const { initial } = locate(touch)
    const playerWheel = gameStateRef.current.ships.find(ship => ship.id === gameStateRef.current.playerId)?.wheel ?? 0

    return (
        <>
            <div style={{
                position: 'absolute',
                left: initial.x,
                top: initial.y,
                transform: 'translateX(-50%)',
                opacity: .75
            }}>
                <WheelFigure size={60} playerWheel={playerWheel} />
            </div>
        </>
    )
}
