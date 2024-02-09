import { CSSProperties, useState } from "react"
import { Directive, FiringPattern, Order, Ship, Side } from "../../game-state"
import { GunneryWidget } from "./GunneryWidget"
import { KeyboardControls } from "../KeyboardControls"
import { SailsWidget } from "./SailsWidget"
import { ShipDashBoard } from "./ShipDashboard"
import { WheelWidget } from "./WheelWidget"
import { MeleeControls } from "./MeleeControl"

interface Props {
    player?: Ship
    addDirective: { (directive: Directive): void }
    paused: boolean
    playerWheel: number
    wheelRef: React.MutableRefObject<number | undefined>
    wheelNotLockedByPointerRef: React.MutableRefObject<boolean>
    wheelNotLockedByKeyboardRef: React.MutableRefObject<boolean>
}

const directiveKeys: Record<string, Directive | undefined> = {
    'KeyW': { order: Order.SAILS_BY, quantity: .2 },
    'KeyS': { order: Order.SAILS_BY, quantity: -.2 },
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

const controlsStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
}

export const GameControls = ({ player, addDirective, paused, playerWheel, wheelRef, wheelNotLockedByPointerRef, wheelNotLockedByKeyboardRef }: Props) => {

    const [firingPattern, setFiringPattern] = useState<FiringPattern>(FiringPattern.BROADSIDE)
    const setWheelTo = (value: number) => { wheelRef.current = value }

    const keyDownFunction = (event: KeyboardEvent) => {
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
    }

    const keyMapFunction = (keyMap: Record<string, boolean>) => {
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
    }

    return (
        <aside style={controlsStyle}>
            {player && (<>
                <WheelWidget
                    addDirective={addDirective}
                    playerWheel={playerWheel}
                    setWheelTo={setWheelTo}
                    wheelNotLockedByPointerRef={wheelNotLockedByPointerRef}
                />
                <SailsWidget
                    setSailLevelTarget={(value) => {
                        addDirective({ order: Order.SAILS_TO, quantity: value })
                    }}
                    ship={player} />
                <GunneryWidget
                    ship={player}
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
                    ship={{...player}}
                />
                <KeyboardControls
                    keyDownFunction={keyDownFunction}
                    keyMapFunction={keyMapFunction}
                />
            </>
            )}
        </aside>
    )
}