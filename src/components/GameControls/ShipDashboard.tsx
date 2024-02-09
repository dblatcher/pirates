import { memo } from "react";
import { Ship } from "../../game-state";

interface Props {
    ship: Ship
}



const ShipDashBoard = memo(({ ship }: Props) => {
    return (
        <div className="panel-frame" style={{ flex: 1 }}>
            <p>
                damage: {ship.damage} / {ship.profile.maxHp}
            </p>
        </div>
    )
}, ((prevProps, nextProps) => {
    return prevProps.ship.damage === nextProps.ship.damage && prevProps.ship.profile.maxHp === nextProps.ship.profile.maxHp
}))

export { ShipDashBoard }