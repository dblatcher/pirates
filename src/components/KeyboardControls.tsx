import { useEffect, useState } from "react"
import { Directive, Order, Side, FiringPattern } from "../game-state"
import { useInterval } from "../hooks/useInterval"

interface Props {
    paused: boolean
    addDirective: { (directive: Directive): void }
    firingPattern: FiringPattern,
    setFiringPattern: { (firingPattern: FiringPattern): void }
    setWheelTo: { (value: number): void }
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

export const KeyboardControls = ({ paused, addDirective, firingPattern, setFiringPattern, setWheelTo }: Props) => {
    const [keyMap, setKeyMap] = useState<Record<string, boolean>>({})

    const handleKeyDown = (event: KeyboardEvent) => {
        setKeyMap({ ...keyMap, [event.code]: true })
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

    const handleKeyUp = (event: KeyboardEvent) => {
        setKeyMap({ ...keyMap, [event.code]: false })
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    })


    useInterval(() => {
        const turn = keyMap['KeyA']
            ? .5
            : keyMap['KeyD']
                ? -.5
                : undefined

        if (turn) {
            setWheelTo(turn)
        }
    }, 0)

    return <></>
}