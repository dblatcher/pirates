import { Ship, Town } from "../game-state/ship";

interface Props {
    ship: Ship
    townInvading?: Town
}

export const ShipDashBoard = ({ ship, townInvading }: Props) => {
    return (
        <div className="panel-frame">
            <p>
                damage: {ship.damage} / {ship.profile.maxHp}
            </p>
            <p>
                invading: {townInvading?.name}
            </p>
        </div>
    )
}