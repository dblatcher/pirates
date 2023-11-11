import { useEffect } from "react"
import { Directive, Order, Side } from "../game-state/types"

interface Props {
    paused: boolean
    addDirective: { (directive: Directive): void }
    turnWheel: { (wheel: number): void }
}

const directiveKeys: Record<string, Directive | undefined> = {
    'ArrowUp': { order: Order.SAILS_BY, quantity: .1 },
    'ArrowDown': { order: Order.SAILS_BY, quantity: -.1 },
    'KeyA': { order: Order.FIRE, side: Side.LEFT },
    'KeyD': { order: Order.FIRE, side: Side.RIGHT },
}

const wheelKeys:Record<string, number | undefined> = {
    'ArrowLeft': .5,
    'ArrowRight': -.5,
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