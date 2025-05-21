import { FullGestureState, useGesture } from "@use-gesture/react";
import { FunctionComponent, ReactNode, useCallback, useRef } from "react";
import { useControls } from "../context/control-context";
import { useManagement } from "../context/management-context";
import { FiringPattern, Order, Side } from "../game-state";
import { clamp } from "../lib/util";

interface Props {
    children: ReactNode
}

export const TouchControlWrapper: FunctionComponent<Props> = ({ children }) => {

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

    const bindGestures = useGesture({
        onDrag: handleDrag,
        onDoubleClick: ({ event }) => {

            const rect = (elementRef.current?.getBoundingClientRect())
            if (!rect) {
                return
            }
            const elementCoords = { x: event.pageX - rect.left, y: event.pageY - rect.top }
            console.log(elementCoords)

            // TO DO - locate the tap to determine which side to fire from
            // relative to ship position and orientation...
            center.sendDirective({
                side: elementCoords.x < rect.width / 2 ? Side.LEFT : Side.RIGHT,
                order: Order.FIRE,
                pattern: FiringPattern.ALTERNATE
            })
        }
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