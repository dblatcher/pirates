import { Side, ShipCannon } from "../../game-state"


const cooldownToSymbol = (cooldown: number): string =>
    cooldown === 0 ? '◆' : '◇'

const sideToDescription = (side: Side): string => {
    switch (side) {
        case Side.LEFT: return `Port Guns`
        case Side.RIGHT: return `Star'd Guns`
        default: return 'Cannons'
    }
}

const CannonColumn = (props: { cannons: ShipCannon[], offset?: boolean }) => (
    <div style={{
        display: "inline-flex",
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'monospace',
        fontSize: '.5rem',
        lineHeight: 1,
        transform: props.offset ? 'translateY(.5em)' : undefined
    }}>
        {props.cannons.map((cannon, index) => (
            <b key={index}>{cooldownToSymbol(cannon.cooldown)}</b>
        ))}
    </div>
)

export const CannonIndicator = ({ cannons, side }: { cannons: ShipCannon[], side: Side }) => {

    if (cannons.length < 5) {
        return (
            <div title={sideToDescription(side)}>
                <CannonColumn cannons={cannons} />
            </div>
        )
    }

    const columnOne: ShipCannon[] = []
    const columnTwo: ShipCannon[] = []

    cannons.forEach((cannon, index) => {
        (index % 2 === 0 ? columnOne : columnTwo).push(cannon)
    })

    return (
        <div title={sideToDescription(side)} style={{
            display: 'flex',
            flexDirection: side === Side.RIGHT ? 'row-reverse' : 'row',
        }}>
            <CannonColumn cannons={columnOne} />
            <CannonColumn cannons={columnTwo} offset />
        </div>
    )
}