import { Directive, Order, Side } from "../game-state/types";
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

    const goLeft = () => {
        addUnlessPaused({ order: Order.LEFT })
    }
    const goRight = () => {
        addUnlessPaused({ order: Order.RIGHT })
    }

    const sailsTo = (quantity: number) => () => {
        addUnlessPaused({ order: Order.SAILS_TO, quantity })
    }
    const headingTo = (quantity: number) => () => {
        addUnlessPaused({ order: Order.HEADING_TO, quantity })
    }
    const fireTo = (side: Side) => () => {
        addUnlessPaused({ order: Order.FIRE, side })
    }

    return <div>
        <div>
            <button onClick={goLeft}>left</button>
            <button onClick={goRight}>right</button>
            <button onClick={sailsTo(0)}>sails down</button>
            <button onClick={sailsTo(.5)}>half sails</button>
            <button onClick={sailsTo(1)}>full sails</button>
            <button onClick={fireTo(Side.RIGHT)}>FIRE</button>
            <button onClick={fireTo(Side.LEFT)}>FIRE</button>
        </div>
        <div>
            <button onClick={headingTo(0)}>0</button>
            <button onClick={headingTo(_DEG * 120)}>120</button>
            <button onClick={headingTo(_DEG * 60)}>240</button>
            <button onClick={headingTo(_DEG * 360)}>360</button>
        </div>
    </div>
}