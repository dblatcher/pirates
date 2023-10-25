import { Directive } from "../game-state/types";

interface Props {
    addDirective: { (directive: Directive): void }
}

export const Controls = ({ addDirective }: Props) => {

    const goLeft = () => {
        addDirective('LEFT')
    }
    const goRight = () => {
        addDirective('RIGHT')
    }

    return <div>
        <button onClick={goLeft}>left</button>
        <button onClick={goRight}>right</button>
        
    </div>
}