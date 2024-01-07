import { Fragment, useId } from "react";
import { Directive, FiringPattern, Order, Ship, Side } from "../../game-state";
import { splitArray } from "../../lib/util";
import { CannonIndicator } from "./CannonIndicator";

interface Props {
    ship: Ship
    addDirective: { (directive: Directive): void }
    paused: boolean
    firingPattern: FiringPattern,
    setFiringPattern: { (firingPattern: FiringPattern): void }
}


const patternToDescription = (pattern: FiringPattern): string => {
    switch (pattern) {
        case FiringPattern.BROADSIDE: return 'B'
        case FiringPattern.CASCADE: return 'C'
        case FiringPattern.ALTERNATE: return 'A'
        default: return '?'
    }
}

export const GunneryWidget = ({ ship, paused, addDirective, firingPattern, setFiringPattern }: Props) => {

    const radioId = useId()

    const addUnlessPaused = (directive: Directive) => {
        if (paused) { return }
        addDirective(directive)
    }
    const fireTo = (side: Side) => () => {
        addUnlessPaused({ order: Order.FIRE, side, pattern: firingPattern })
    }

    const [leftCannons, rightCannons] = splitArray(ship.cannons, (_ => _.side === Side.LEFT))

    return (
        <div className="panel-frame">

            {[FiringPattern.BROADSIDE, FiringPattern.CASCADE, FiringPattern.ALTERNATE].map((pattern, index) => (
                <Fragment key={index}>
                    <label htmlFor={`${radioId}-${pattern.toString()}`}>{patternToDescription(pattern)}</label>
                    <input type="radio"
                        name="pattern"
                        id={`${radioId}-${pattern.toString()}`}
                        value={pattern} checked={firingPattern === pattern}
                        onChange={() => { setFiringPattern(pattern) }}
                    />
                </Fragment>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 5 }}>
                <button onClick={fireTo(Side.LEFT)}>
                    <CannonIndicator cannons={leftCannons} side={Side.LEFT} />
                </button>
                <button onClick={fireTo(Side.RIGHT)}>
                    <CannonIndicator cannons={rightCannons} side={Side.RIGHT} />
                </button>
            </div>
        </div>
    )
}
