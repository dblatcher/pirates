import { useEffect } from "react"
import { Directive, Order, Side, FiringPattern } from "../game-state/types"

interface Props {
    paused: boolean
    addDirective: { (directive: Directive): void }
    turnWheel: { (wheel: number): void }
}

const directiveKeys: Record<string, Directive | undefined> = {
    'KeyW': { order: Order.SAILS_BY, quantity: .1 },
    'KeyS': { order: Order.SAILS_BY, quantity: -.1 },
    'KeyQ': { order: Order.FIRE, side: Side.LEFT, pattern: FiringPattern.ALTERNATE },
    'KeyE': { order: Order.FIRE, side: Side.RIGHT, pattern: FiringPattern.ALTERNATE },
}

const wheelKeys: Record<string, number | undefined> = {
    'KeyA': .5,
    'KeyD': -.5,
}

export const KeyboardControls = ({ paused, addDirective, turnWheel }: Props) => {

    const handleKey = (event: KeyboardEvent) => {
        if (paused) {
            return
        }
        // console.log(event)
        const directive = directiveKeys[event.code]
        if (directive) {
            addDirective(directive)
        }
        const wheelTurn = wheelKeys[event.code]
        if (typeof wheelTurn === 'number') {
            turnWheel(wheelTurn)
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