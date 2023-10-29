import { Directive, Order } from "../game-state/types";

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
    const fireTo = (side: 'LEFT' | 'RIGHT') => () => {
        addUnlessPaused({ order: Order.FIRE, side })
    }

    return <div>
        <button onClick={goLeft}>left</button>
        <button onClick={goRight}>right</button>
        <button onClick={sailsTo(0)}>sails down</button>
        <button onClick={sailsTo(.5)}>half sails</button>
        <button onClick={sailsTo(1)}>full sails</button>
        <button onClick={fireTo('RIGHT')}>FIRE</button>
        <button onClick={fireTo('LEFT')}>FIRE</button>
    </div>
}