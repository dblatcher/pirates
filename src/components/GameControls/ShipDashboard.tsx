import { memo } from "react";
import { Ship } from "../../game-state";

interface Props {
    ship: Ship,
    mapOpen: boolean,
    setMapOpen: { (value: boolean): void },
}



const ShipDashBoard = memo(({ ship, mapOpen, setMapOpen }: Props) => {
    return (
        <div className="panel-frame" style={{ flex: 1 }}>
            <p>
                damage: {ship.damage} / {ship.profile.maxHp}
            </p>
            <button onClick={() => setMapOpen(!mapOpen)}>map</button>
        </div>
    )
}, ((prevProps, nextProps) => {
    return (
        prevProps.ship.damage === nextProps.ship.damage &&
        prevProps.ship.profile.maxHp === nextProps.ship.profile.maxHp &&
        prevProps.mapOpen === nextProps.mapOpen
    )
}))

export { ShipDashBoard }