import { Directive, FiringPattern, Order, Side } from "../game-state/types";
import { _DEG } from "../lib/geometry";

interface Props {
    addDirective: { (directive: Directive): void }
    paused: boolean
}

export const Controls = ({ addDirective, paused }: Props) => {

    const addUnlessPaused = (directive: Directive) => {
        if (paused) { return }
        addDirective(directive)
    }

    const headingTo = (degrees: number) => () => {
        addUnlessPaused({ order: Order.HEADING_TO, quantity: _DEG * degrees })
    }
    const fireTo = (side: Side) => () => {
        addUnlessPaused({ order: Order.FIRE, side, pattern:FiringPattern.BROADSIDE })
    }

    return (
        <div className="panel-frame">
            <div>
                <button onClick={fireTo(Side.LEFT)}>FIRE</button>
                <button onClick={fireTo(Side.RIGHT)}>FIRE</button>
            </div>
            <div>
                <button onClick={headingTo(180)}>&uarr;</button>
                <button onClick={headingTo(90)}>&rarr;</button>
                <button onClick={headingTo(0)}>&darr;</button>
                <button onClick={headingTo(270)}>&larr;</button>
            </div>
        </div>
    )
}