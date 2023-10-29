import { useEffect } from "react"
import { Directive, Order, Side } from "../game-state/types"

interface Props {
    paused: boolean
    addDirective: { (directive: Directive): void }
}

const keyCommands: Record<string, Directive | undefined> = {
    'ArrowLeft': { order: Order.LEFT },
    'ArrowRight': { order: Order.RIGHT },
    'ArrowUp': { order: Order.SAILS_BY, quantity: .1 },
    'ArrowDown': { order: Order.SAILS_BY, quantity: -.1 },
    'KeyA': { order: Order.FIRE, side: Side.LEFT },
    'KeyD': { order: Order.FIRE, side: Side.RIGHT },
}

export const KeyboardControls = ({ paused, addDirective }: Props) => {

    const handleKey = (event: KeyboardEvent) => {
        if (paused) {
            return
        }
        // console.log(event)
        const directive = keyCommands[event.code]
        if (directive) {
            addDirective(directive)
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