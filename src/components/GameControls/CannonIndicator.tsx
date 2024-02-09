import { Side } from "../../game-state"

const sideToDescription = (side: Side): string => {
    switch (side) {
        case Side.LEFT: return `Port Guns`
        case Side.RIGHT: return `Star'd Guns`
        default: return 'Cannons'
    }
}

const CannonColumn = (props: { cannonsReady: boolean[], offset?: boolean }) => (
    <div style={{
        display: "inline-flex",
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'monospace',
        fontSize: '.5rem',
        lineHeight: 1,
        transform: props.offset ? 'translateY(.5em)' : undefined
    }}>
        {props.cannonsReady.map((ready, index) => (
            <b key={index}>{ready ? '◆' : '◇'}</b>
        ))}
    </div>
)

export const CannonIndicator = ({ cannons, side }: { cannons: boolean[], side: Side }) => {

    if (cannons.length < 5) {
        return (
            <div title={sideToDescription(side)}>
                <CannonColumn cannonsReady={cannons} />
            </div>
        )
    }

    const columnOne: boolean[] = []
    const columnTwo: boolean[] = []

    cannons.forEach((cannon, index) => {
        (index % 2 === 0 ? columnOne : columnTwo).push(cannon)
    })

    return (
        <div title={sideToDescription(side)} style={{
            display: 'flex',
            flexDirection: side === Side.RIGHT ? 'row-reverse' : 'row',
        }}>
            <CannonColumn cannonsReady={columnOne} />
            <CannonColumn cannonsReady={columnTwo} offset />
        </div>
    )
}