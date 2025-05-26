import { DragState, useGesture } from "@use-gesture/react";
import { FunctionComponent, MutableRefObject, ReactNode, useCallback, useRef, useState } from "react";
import { useControls } from "../context/control-context";
import { useManagement } from "../context/management-context";
import { FiringPattern, GameState, Order, Side, ViewPort } from "../game-state";
import { findRotationBetweenHeadings, getHeading, getVectorFrom, XY } from "../lib/geometry";
import { clamp } from "../lib/util";
import { TouchIndicator } from "./TouchIndicator";

interface Props {
    children: ReactNode
    gameStateRef: MutableRefObject<GameState>
    viewPortRef: MutableRefObject<ViewPort>
}


export const TouchControlWrapper: FunctionComponent<Props> = ({ children, gameStateRef, viewPortRef }) => {

    const elementRef = useRef<HTMLDivElement>(null);
    const [lastPointerToMoveSails, setLastPointerToMoveSail] = useState<number>();

    const { center } = useControls()
    const { controlMode } = useManagement()
    const [touches, setTouches] = useState<DragState[]>([])

    const showSail = !!lastPointerToMoveSails && touches[0]?._pointerId === lastPointerToMoveSails;

    const locateTouch = useCallback(
        (state: DragState) => {
            const { initial, values: current } = state
            const rect = elementRef.current?.getBoundingClientRect();
            if (!rect) {
                return {
                    initial: { x: 0, y: 0 },
                    current: { x: 0, y: 0 },
                }
            }
            return {
                initial: { x: initial[0] - rect.left, y: initial[1] - rect.top },
                current: { x: current[0] - rect.left, y: current[1] - rect.top },
            }
        },
        []
    )

    const handleFireTap = useCallback(
        (clickCoords: XY) => {
            const rect = elementRef.current?.getBoundingClientRect();
            const player = gameStateRef.current.ships.find(ship => ship.id === gameStateRef.current.playerId)
            const { current: viewPort } = viewPortRef
            if (!player || !viewPort || !rect) {
                return
            }
            const playerCoords = {
                x: (player.x - viewPort.x) / viewPort.width * rect.width,
                y: (player.y - viewPort.y) / viewPort.height * rect.height
            }
            const heading = getHeading(getVectorFrom(playerCoords, clickCoords))
            center.sendDirective({
                side: findRotationBetweenHeadings(heading, player.h) < 0 ? Side.LEFT : Side.RIGHT,
                order: Order.FIRE,
                pattern: FiringPattern.ALTERNATE
            })
        },
        [center, gameStateRef, viewPortRef])

    const handleDrag = useCallback((state: DragState) => {
        setTouches(current => current.map(t => t._pointerId === state._pointerId ? state : t))

        const xMovement = state.movement[0]
        const yDelta = state.delta[1]

        if (Math.abs(yDelta) > 2) {
            setLastPointerToMoveSail(state._pointerId);
            center.sendDirective({
                order: Order.SAILS_BY,
                quantity: (-yDelta - 2 * Math.sign(yDelta)) / 100
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

        onDragStart: (state) => {
            if (!state._pointerId) {
                return
            }
            setTouches(current => [...current, state])
        },
        onDragEnd: (state) => {
            const { _pointerId } = state;
            if (_pointerId) {
                setTouches(current => current.filter(t => t._pointerId != _pointerId))
            }
            if (state.tap) {
                handleFireTap(locateTouch(state).initial)
            }
        },
        onDrag: handleDrag,
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
        <TouchIndicator
            touch={touches[0]}
            locate={locateTouch}
            gameStateRef={gameStateRef}
            showSail={showSail}
        />
    </ div>

}