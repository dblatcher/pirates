import { useEffect } from "react"
import { Directive, Order, Side, FiringPattern } from "../game-state"

interface Props {
    paused: boolean
    addDirective: { (directive: Directive): void }
    turnWheel: { (wheel: number): void }
    firingPattern: FiringPattern,
    setFiringPattern: { (firingPattern: FiringPattern): void }
}

const directiveKeys: Record<string, Directive | undefined> = {
    'KeyW': { order: Order.SAILS_BY, quantity: .1 },
    'KeyS': { order: Order.SAILS_BY, quantity: -.1 },
    'KeyQ': { order: Order.FIRE, side: Side.LEFT, pattern: FiringPattern.ALTERNATE },
    'KeyE': { order: Order.FIRE, side: Side.RIGHT, pattern: FiringPattern.ALTERNATE },
    'Space': { order: Order.INVADE_TOWN },
}

const wheelKeys: Record<string, number | undefined> = {
    'KeyA': .5,
    'KeyD': -.5,
}

const patternKeys: Record<string, FiringPattern | undefined> = {
    'Digit1': FiringPattern.BROADSIDE,
    'Digit2': FiringPattern.CASCADE,
    'Digit3': FiringPattern.ALTERNATE,
}

export const KeyboardControls = ({ paused, addDirective, turnWheel, firingPattern, setFiringPattern }: Props) => {

    const handleKey = (event: KeyboardEvent) => {
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
        const wheelTurn = wheelKeys[event.code]
        if (typeof wheelTurn === 'number') {
            turnWheel(wheelTurn)
        }
        const patternChange = patternKeys[event.code]
        if (typeof patternChange === 'number') {
            setFiringPattern(patternChange)
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKey)
        return () => {
            window.removeEventListener('keydown', handleKey)
        }
    })

    return <></>
}