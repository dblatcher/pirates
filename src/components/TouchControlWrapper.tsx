import { FullGestureState, SharedGestureState, useGesture } from "@use-gesture/react";
import { FunctionComponent, MutableRefObject, ReactNode, useCallback, useRef } from "react";
import { useControls } from "../context/control-context";
import { useManagement } from "../context/management-context";
import { FiringPattern, GameState, Order, Side } from "../game-state";
import { clamp } from "../lib/util";
import { findRotationBetweenHeadings, getHeading, getVectorFrom, normaliseHeading } from "../lib/geometry";

interface Props {
    children: ReactNode
    gameStateRef: MutableRefObject<GameState>
}

export const TouchControlWrapper: FunctionComponent<Props> = ({ children, gameStateRef }) => {

    const elementRef = useRef<HTMLDivElement>(null);
    const { center } = useControls()
    const { controlMode } = useManagement()

    const handleDrag = useCallback((state: Omit<FullGestureState<"drag">, "event"> & {
        event: PointerEvent | MouseEvent | TouchEvent | KeyboardEvent;
    }) => {
        const xMovement = state.movement[0]
        const yDelta = state.delta[1]

        if (Math.abs(yDelta) > 1.5) {
            center.sendDirective({
                order: Order.SAILS_BY,
                quantity: (-yDelta - 1.5 * Math.sign(yDelta)) / 100
            })
        }

        center.wheelFreeFromPointer.current = false
        if (state.event.type === 'pointerup') {
            center.wheelFreeFromPointer.current = true
        }

        const adjustedXMovement = -Math.sign(xMovement) * clamp(Math.abs(xMovement) / 100, .5);
        center.sendWheelValue(adjustedXMovement)
    }, [center])

    const handleDoubleClick = useCallback(
        ({ event }: SharedGestureState & {
            event: MouseEvent;
        }) => {
            const rect = (elementRef.current?.getBoundingClientRect())
            if (!rect) {
                return
            }
            const clickCoords = { x: event.pageX - rect.left, y: event.pageY - rect.top }
            const elementCenter = { x: rect.width / 2, y: rect.height / 2 } // to do - use the point on the element where the player is plotted

            const heading = normaliseHeading(getHeading(getVectorFrom(elementCenter, clickCoords)))
            const player = gameStateRef.current.ships.find(ship => ship.id === gameStateRef.current.playerId)

            center.sendDirective({
                side: findRotationBetweenHeadings(heading, player?.h ?? 0) < 0 ? Side.LEFT : Side.RIGHT,
                order: Order.FIRE,
                pattern: FiringPattern.ALTERNATE
            })
        }, [center, gameStateRef])

    const bindGestures = useGesture({
        onDrag: handleDrag,
        onDoubleClick: handleDoubleClick
    }, {
        enabled: controlMode === 'touchscreen'
    })

    return <div
        ref={elementRef}
        style={{
            position: 'relative',
            touchAction: 'none',
        }}
        {...bindGestures()}
    >
        {children}
    </ div>

}