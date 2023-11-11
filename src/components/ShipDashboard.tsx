import { Ship } from "../game-state/ship";
import { Side } from "../game-state/types";

interface Props {
    ship: Ship
}

const sideToDescription = (side: Side): string => {
    switch (side) {
        case Side.LEFT: return `Port Guns`
        case Side.RIGHT: return `Starboard Guns`
        default: return 'Cannons'
    }
}

export const ShipDashBoard = ({ ship }: Props) => {

    const { cannons } = ship

    return (
        <div className="panel-frame">
            <p>
                speed: {ship.speedLastTurn.toFixed(2)}
            </p>
            {cannons.map((cannon, index) => (
                <p key={index}>
                    <span>{sideToDescription(cannon.side)}</span>
                    <span>{' | '}</span>
                    <span>{cannon.cooldown > 0 ? (
                        'loading'
                    ):(
                        'ready'
                    )}</span>
                </p>
            ))}
        </div>
    )

}