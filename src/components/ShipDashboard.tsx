import { Ship, Cannon } from "../game-state/ship";
import { Side } from "../game-state/types";
import { splitArray } from "../lib/util";

interface Props {
    ship: Ship
}

const sideToDescription = (side: Side): string => {
    switch (side) {
        case Side.LEFT: return `Port Guns`
        case Side.RIGHT: return `Star'd Guns`
        default: return 'Cannons'
    }
}

const CannonIndicator = ({ cannons, side }: { cannons: Cannon[], side: Side }) => (
    <div>
        <p>{sideToDescription(side)}</p>
        <div style={{
            display: "flex",
            flexDirection: 'column',
            fontFamily: 'monospace',
            fontSize: '.5rem',
            lineHeight: 1
        }}>
            {cannons.map((cannon, index) => (
                <b key={index}>{cannon.cooldown > 0 ? '-' : '*'}</b>
            ))}
        </div>
    </div>
)

export const ShipDashBoard = ({ ship }: Props) => {


    const [leftCannons, rightCannons] = splitArray(ship.cannons, (_ => _.side === Side.LEFT))

    return (
        <div className="panel-frame">
            <p>
                speed: {ship.speedLastTurn.toFixed(2)}
            </p>
            <div style={{ display: 'flex' }}>
                <CannonIndicator cannons={leftCannons} side={Side.LEFT} />
                <CannonIndicator cannons={rightCannons} side={Side.RIGHT} />
            </div>
            <p>
                damage: {ship.damage} / {ship.profile.maxHp}
            </p>
        </div>
    )

}