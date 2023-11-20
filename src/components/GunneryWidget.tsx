import { Fragment, useId } from "react";
import { Ship, ShipCannon } from "../game-state/ship";
import { Directive, FiringPattern, Order, Side } from "../game-state";
import { splitArray } from "../lib/util";

interface Props {
    ship: Ship
    addDirective: { (directive: Directive): void }
    paused: boolean
    firingPattern: FiringPattern,
    setFiringPattern: { (firingPattern: FiringPattern): void }
}

const sideToDescription = (side: Side): string => {
    switch (side) {
        case Side.LEFT: return `Port Guns`
        case Side.RIGHT: return `Star'd Guns`
        default: return 'Cannons'
    }
}

const patternToDescription = (pattern: FiringPattern): string => {
    switch (pattern) {
        case FiringPattern.BROADSIDE: return 'B'
        case FiringPattern.CASCADE: return 'C'
        case FiringPattern.ALTERNATE: return 'A'
        default: return '?'
    }
}

const cooldownToSymbol = (cooldown: number): string =>
    cooldown === 0 ? '◆' : '◇'

const CannonIndicator = ({ cannons, side }: { cannons: ShipCannon[], side: Side }) => (
    <div title={sideToDescription(side)}>
        <div style={{
            display: "flex",
            flexDirection: 'column',
            alignItems: 'center',
            fontFamily: 'monospace',
            fontSize: '.5rem',
            lineHeight: 1
        }}>
            {cannons.map((cannon, index) => (
                <b key={index}>{cooldownToSymbol(cannon.cooldown)}</b>
            ))}
        </div>
    </div>
)

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
            <div style={{ display: 'flex' }}>
                <div>
                    <button onClick={fireTo(Side.LEFT)}>FIRE</button>
                    <CannonIndicator cannons={leftCannons} side={Side.LEFT} />
                </div>
                <div>
                    <button onClick={fireTo(Side.RIGHT)}>FIRE</button>
                    <CannonIndicator cannons={rightCannons} side={Side.RIGHT} />
                </div>
            </div>

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
        </div>
    )
}
