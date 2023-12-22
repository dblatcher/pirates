import { useState } from "react"
import { Directive, FiringPattern, Order, Ship, Side } from "../game-state"
import { GunneryWidget } from "./GunneryWidget"
import { KeyboardControls } from "./KeyboardControls"
import { SailsWidget } from "./SailsWidget"
import { ShipDashBoard } from "./ShipDashboard"
import { WheelWidget } from "./WheelWidget"

interface Props {
    player?: Ship
    addDirective: { (directive: Directive): void }
    paused: boolean
    playerWheel: number
    wheelRef: React.MutableRefObject<number | undefined>
}

const directiveKeys: Record<string, Directive | undefined> = {
    'KeyW': { order: Order.SAILS_BY, quantity: .1 },
    'KeyS': { order: Order.SAILS_BY, quantity: -.1 },
    'KeyQ': { order: Order.FIRE, side: Side.LEFT, pattern: FiringPattern.ALTERNATE },
    'KeyE': { order: Order.FIRE, side: Side.RIGHT, pattern: FiringPattern.ALTERNATE },
    'Space': { order: Order.INVADE_TOWN },
}

const patternKeys: Record<string, FiringPattern | undefined> = {
    'Digit1': FiringPattern.BROADSIDE,
    'Digit2': FiringPattern.CASCADE,
    'Digit3': FiringPattern.ALTERNATE,
}

export const GameControls = ({ player, addDirective, paused, playerWheel, wheelRef }: Props) => {

    const [firingPattern, setFiringPattern] = useState<FiringPattern>(FiringPattern.BROADSIDE)
    const setWheelTo = (value: number) => { wheelRef.current = value }

    const keyDownFunction = (event: KeyboardEvent) => {
        const directive = directiveKeys[event.code]
        if (paused) {
            return
        }
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
        const turn = keyMap['KeyA']
            ? .5
            : keyMap['KeyD']
                ? -.5
                : undefined

        if (turn) {
            setWheelTo(turn)
        }
    }

    return (
        <aside style={{ display: 'flex' }}>
            {player && (<>
                <WheelWidget
                    addDirective={addDirective}
                    playerWheel={playerWheel}
                    setWheelTo={setWheelTo}
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
                <ShipDashBoard
                    ship={player}
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