import { Ship } from "../game-state/ship";

interface Props {
    ship: Ship
}

export const ShipDashBoard = ({ ship }: Props) => {
    return (
        <div className="panel-frame">
            <p>
                speed: {ship.speedLastTurn.toFixed(2)}
            </p>
            <p>
                damage: {ship.damage} / {ship.profile.maxHp}
            </p>
        </div>
    )
}