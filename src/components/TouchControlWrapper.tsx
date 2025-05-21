import { FullGestureState, useGesture } from "@use-gesture/react";
import { FunctionComponent, ReactNode } from "react";
import { Order, Side, FiringPattern } from "../game-state";
import { clamp } from "../lib/util";
import { useControls } from "../context/control-context";
import { useManagement } from "../context/management-context";

interface Props {
    children: ReactNode
}

export const TouchControlWrapper: FunctionComponent<Props> = ({ children }) => {

    const { center } = useControls()
    const { controlMode } = useManagement()

    const handleDrag = (state: Omit<FullGestureState<"drag">, "event"> & {
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
    }

    const bindGestures = useGesture({
        onDrag: handleDrag,
        onDoubleClick: ({ event }) => {
            console.log(event.clientX, event.clientY, event.target)
            // TO DO - locate the tap to determine which side to fire from
            center.sendDirective({
                side: Side.LEFT,
                order: Order.FIRE,
                pattern: FiringPattern.ALTERNATE
            })
        }
    }, {
        enabled: controlMode === 'touchscreen'
    })

    return <div
        style={{
            position: 'relative',
            touchAction: 'none',
        }}
        {...bindGestures()}
    >
        {children}
    </ div>

}