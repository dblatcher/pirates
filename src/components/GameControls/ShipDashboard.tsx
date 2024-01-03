import { Ship } from "../../game-state";

interface Props {
    ship: Ship
}

export const ShipDashBoard = ({ ship }: Props) => {
    return (
        <div className="panel-frame" style={{flex:1}}>
            <p>
                damage: {ship.damage} / {ship.profile.maxHp}
            </p>
            <p>
                marines: {ship.marines}
            </p>
        </div>
    )
}