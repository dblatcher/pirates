import { Directive, Order } from "../game-state/types";

interface Props {
    addDirective: { (directive: Directive): void }
}

export const Controls = ({ addDirective }: Props) => {

    const goLeft = () => {
        addDirective({ order: Order.LEFT })
    }
    const goRight = () => {
        addDirective({ order: Order.RIGHT })
    }

    const sailsTo = (quantity: number) => () => {
        addDirective({ order: Order.SAILS, quantity })
    }
    const fireTo = (quantity: number) => () => {
        addDirective({ order: Order.FIRE, quantity })
    }

    return <div>
        <button onClick={goLeft}>left</button>
        <button onClick={goRight}>right</button>
        <button onClick={sailsTo(0)}>sails down</button>
        <button onClick={sailsTo(.5)}>half sails</button>
        <button onClick={sailsTo(1)}>full sails</button>
        <button onClick={fireTo(.5)}>FIRE</button>
        <button onClick={fireTo(-.5)}>FIRE</button>
    </div>
}