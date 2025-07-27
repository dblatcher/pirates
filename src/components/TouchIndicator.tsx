import { DragState } from "@use-gesture/react"
import { FunctionComponent, MutableRefObject } from "react"
import { GameState } from "../game-state"
import { XY } from "typed-geometry"
import { WheelFigure } from "./WheelFigure"
import { SailsFigure } from "./SailsFigure"


type Props = {
    touch?: DragState
    locate: { (state: DragState): { initial: XY, current: XY } }
    gameStateRef: MutableRefObject<GameState>
    showSail: boolean
}


export const TouchIndicator: FunctionComponent<Props> = ({ touch, locate, gameStateRef, showSail }) => {

    if (!touch || touch.elapsedTime < 100) {
        return null
    }
    const { initial } = locate(touch)
    const player = gameStateRef.current.ships.find(ship => ship.id === gameStateRef.current.playerId);
    const { sailLevel = 0, sailLevelTarget = 0, wheel = 0 } = player ?? {};

    return (
        <>
            <div style={{
                position: 'absolute',
                left: initial.x,
                top: initial.y,
                transform: 'translateX(-50%)',
                opacity: .75,
                display: 'flex',
            }}>
                <WheelFigure size={60} playerWheel={wheel} />
                {showSail && (
                    <SailsFigure
                        sailLevel={sailLevel}
                        sailLevelTarget={sailLevelTarget}
                        width={60}
                        height={60}
                    />
                )}
            </div>
        </>
    )
}
