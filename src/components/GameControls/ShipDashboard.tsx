import { memo } from "react";
import { Objective, Ship } from "../../game-state";

interface Props {
    ship: Ship,
    mapOpen: boolean,
    setMapOpen: { (value: boolean): void },
    objectives: Objective[]
}

const listObjectivesObtained = (objectives: Objective[]) => objectives.filter(_ => _.obtained).map(_ => _.name).join()

const ShipDashBoard = memo(({ ship, mapOpen, setMapOpen, objectives }: Props) => {
    return (
        <div className="panel-frame" style={{ flex: 1 }}>
            <p>
                damage: {ship.damage} / {ship.profile.maxHp}
            </p>
            <button onClick={() => setMapOpen(!mapOpen)}>map</button>
            {!!(objectives.length) && (
                <p>objectives: {listObjectivesObtained(objectives)}</p>
            )}
        </div>
    )
}, ((prevProps, nextProps) => {
    return (
        prevProps.ship.damage === nextProps.ship.damage &&
        prevProps.ship.profile.maxHp === nextProps.ship.profile.maxHp &&
        prevProps.mapOpen === nextProps.mapOpen &&
        listObjectivesObtained(prevProps.objectives) === listObjectivesObtained(nextProps.objectives)
    )
}))

export { ShipDashBoard }