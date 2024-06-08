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
import { useControls } from "../../context/control-context"
import { makeKeyMapHandler } from "../../lib/key-map-handling"

interface Props {
    player?: Ship
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
    paused,
    playerWheel,
    wheelRef, wheelNotLockedByPointerRef, wheelNotLockedByKeyboardRef,
    sailChangeRef,
    mapOpen, setMapOpen,
}: Props) => {

    const { center } = useControls()
    const [firingPattern, setFiringPattern] = useState<FiringPattern>(FiringPattern.BROADSIDE)
    const setWheelTo = useCallback((value: number) => { wheelRef.current = value }, [wheelRef])

    const keyDownFunction = useCallback((event: KeyboardEvent) => {
        if (paused) {
            return
        }
        const directive = directiveKeys[event.code]
        if (directive) {
            if (directive.order === Order.FIRE) {
                center.sendDirective({ ...directive, pattern: firingPattern })
            } else {
                center.sendDirective(directive)
            }
        }
        const patternChange = patternKeys[event.code]
        if (typeof patternChange === 'number') {
            setFiringPattern(patternChange)
        }

        if (event.code === 'KeyM') {
            setMapOpen(!mapOpen)
        }
    }, [paused, center, firingPattern, setMapOpen, mapOpen])

    const keyMapFunction = useCallback(
        makeKeyMapHandler({ wheelRef, wheelNotLockedByKeyboardRef, sailChangeRef }),
        [wheelRef, wheelNotLockedByKeyboardRef, sailChangeRef]
    )

    const [leftCannons, rightCannons] = splitArray(player?.cannons ?? [], (_ => _.side === Side.LEFT))
    const leftCannonsReady = leftCannons.map(c => c.cooldown <= 0)
    const rightCannonsReady = rightCannons.map(c => c.cooldown <= 0)

    return (
        <aside className="controls-container">
            {player ? (<>
                <WheelWidget
                    playerWheel={playerWheel}
                    setWheelTo={setWheelTo}
                    wheelNotLockedByPointerRef={wheelNotLockedByPointerRef}
                />
                <SailsWidget
                    sailLevel={player.sailLevel}
                    speedLastTurn={player.speedLastTurn}
                    sailLevelTarget={player.sailLevelTarget} />
                <GunneryWidget
                    leftCannons={leftCannonsReady}
                    rightCannons={rightCannonsReady}
                    paused={paused}
                    firingPattern={firingPattern}
                    setFiringPattern={setFiringPattern}
                />
                <MeleeControls
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