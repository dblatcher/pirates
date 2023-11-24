import { Ship, Town } from "../game-state/ship";

interface Props {
    ship: Ship
    townInvading?: Town
}

export const ShipDashBoard = ({ ship, townInvading }: Props) => {
    return (
        <div className="panel-frame">
            <p>
                speed: {ship.speedLastTurn.toFixed(2)}
            </p>
            <p>
                damage: {ship.damage} / {ship.profile.maxHp}
            </p>
            <p>
                launching invasion: {ship.launchingInvasion && 'Y'}
            </p>
            <p>
                invasion in progress: {townInvading?.name}
            </p>
        </div>
    )
}