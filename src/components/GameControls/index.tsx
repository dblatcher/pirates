import { useCallback, useState } from "react"
import { Directive, FiringPattern, Order, Ship, Side } from "../../game-state"
import { splitArray } from "../../lib/util"
import { KeyboardControls } from "../KeyboardControls"
import { GunneryWidget } from "./GunneryWidget"
import { MeleeControls } from "./MeleeControl"
import { SailsWidget } from "./SailsWidget"
import { ShipDashBoard } from "./ShipDashboard"
import { WheelWidget } from "./WheelWidget"
import "./controls.css"

interface Props {
    player?: Ship
    addDirective: { (directive: Directive): void }
    paused: boolean
    playerWheel: number
    wheelRef: React.MutableRefObject<number | undefined>
    wheelNotLockedByPointerRef: React.MutableRefObject<boolean>
    wheelNotLockedByKeyboardRef: React.MutableRefObject<boolean>
    sailChangeRef: React.MutableRefObject<'UP' | 'DOWN' | undefined>
    mapOpen: boolean,
    setMapOpen: { (value: boolean): void }
}

const directiveKeys: Record<string, Directive | undefined> = {
    'KeyQ': { order: Order.FIRE, side: Side.LEFT, pattern: FiringPattern.ALTERNATE },
    'KeyE': { order: Order.FIRE, side: Side.RIGHT, pattern: FiringPattern.ALTERNATE },
    'Space': { order: Order.INVADE_TOWN },
    'KeyB': { order: Order.BOARD_SHIP },
}

const patternKeys: Record<string, FiringPattern | undefined> = {
    'Digit1': FiringPattern.BROADSIDE,
    'Digit2': FiringPattern.CASCADE,
    'Digit3': FiringPattern.ALTERNATE,
}

export const GameControls = ({
    player,
    addDirective,
    paused,
    playerWheel,
    wheelRef, wheelNotLockedByPointerRef, wheelNotLockedByKeyboardRef,
    sailChangeRef,
    mapOpen, setMapOpen,
}: Props) => {

    const [firingPattern, setFiringPattern] = useState<FiringPattern>(FiringPattern.BROADSIDE)
    const setWheelTo = useCallback((value: number) => { wheelRef.current = value }, [wheelRef])
    const setSailLevelTarget = useCallback((value: number) => {
        addDirective({ order: Order.SAILS_TO, quantity: value })
    }, [addDirective])

    const keyDownFunction = useCallback((event: KeyboardEvent) => {
        if (paused) {
            return
        }
        const directive = directiveKeys[event.code]
        if (directive) {
            if (directive.order === Order.FIRE) {
                addDirective({ ...directive, pattern: firingPattern })
            } else {
                addDirective(directive)
            }
        }
        const patternChange = patternKeys[event.code]
        if (typeof patternChange === 'number') {
            setFiringPattern(patternChange)
        }

        if (event.code === 'KeyM') {
            setMapOpen(!mapOpen)
        }
    }, [paused, addDirective, firingPattern, setMapOpen, mapOpen])

    const keyMapFunction = useCallback((keyMap: Record<string, boolean>) => {
        const goingLeft = !!keyMap['KeyA']
        const goingRight = !!keyMap['KeyD']
        const turn = goingLeft && goingRight ? 0 :
            goingLeft
                ? .5
                : goingRight
                    ? -.5
                    : undefined

        wheelNotLockedByKeyboardRef.current = !turn
        if (typeof turn === 'number') {
            setWheelTo(turn)
        }
        const sailsUp = !!keyMap['KeyW'] && !keyMap['KeyS']
        const sailsDown = !!keyMap['KeyS'] && !keyMap['KeyW']
        sailChangeRef.current = sailsUp ? 'UP' : sailsDown ? 'DOWN' : undefined
    }, [setWheelTo, wheelNotLockedByKeyboardRef, sailChangeRef])

    const [leftCannons, rightCannons] = splitArray(player?.cannons ?? [], (_ => _.side === Side.LEFT))
    const leftCannonsReady = leftCannons.map(c => c.cooldown <= 0)
    const rightCannonsReady = rightCannons.map(c => c.cooldown <= 0)

    return (
        <aside className="controls-container">
            {player ? (<>
                <WheelWidget
                    addDirective={addDirective}
                    playerWheel={playerWheel}
                    setWheelTo={setWheelTo}
                    wheelNotLockedByPointerRef={wheelNotLockedByPointerRef}
                />
                <SailsWidget
                    setSailLevelTarget={setSailLevelTarget}
                    sailLevel={player.sailLevel}
                    speedLastTurn={player.speedLastTurn}
                    sailLevelTarget={player.sailLevelTarget} />
                <GunneryWidget
                    leftCannons={leftCannonsReady}
                    rightCannons={rightCannonsReady}
                    addDirective={addDirective}
                    paused={paused}
                    firingPattern={firingPattern}
                    setFiringPattern={setFiringPattern}
                />
                <MeleeControls
                    addDirective={addDirective}
                    alreadyFighting={false}
                    marines={player.marines}
                    maxMarines={player.profile.maxMarines}
                />
                <ShipDashBoard
                    ship={{ ...player }}
                    mapOpen={mapOpen}
                    setMapOpen={setMapOpen}
                />
                <KeyboardControls
                    keyDownFunction={keyDownFunction}
                    keyMapFunction={keyMapFunction}
                />
            </>
            ) : (
                <div className="panel-frame" style={{ flex: 1 }}></div>
            )}
        </aside>
    )
}