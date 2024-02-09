import { Fragment, memo, useId } from "react";
import { Directive, FiringPattern, Order, Side } from "../../game-state";
import { CannonIndicator } from "./CannonIndicator";

interface Props {
    leftCannons: boolean[]
    rightCannons: boolean[]
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

const booleanArraysMatch = (a: boolean[], b: boolean[]): boolean => {
    if (a.length !== b.length) { return false }
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false
        }
    }
    return true
}

export const GunneryWidget = memo(({ leftCannons, rightCannons, paused, addDirective, firingPattern, setFiringPattern }: Props) => {
    const radioId = useId()
    const addUnlessPaused = (directive: Directive) => {
        if (paused) { return }
        addDirective(directive)
    }
    const fireTo = (side: Side) => () => {
        addUnlessPaused({ order: Order.FIRE, side, pattern: firingPattern })
    }

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
}, (prevProps, nextProps) => {
    if (prevProps.paused !== nextProps.paused || prevProps.firingPattern !== nextProps.firingPattern) {
        return false
    }
    if (!booleanArraysMatch(prevProps.leftCannons, nextProps.leftCannons)) {
        return false
    }
    if (!booleanArraysMatch(prevProps.rightCannons, nextProps.rightCannons)) {
        return false
    }
    return true
})

