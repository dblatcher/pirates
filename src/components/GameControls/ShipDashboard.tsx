import { memo } from "react";
import { Objective, Ship } from "../../game-state";

interface Props {
    ship: Ship,
    mapOpen: boolean,
    setMapOpen: { (value: boolean): void },
    objectives: Objective[]
}

const objectivesAreEqual = (prevObjectives: Objective[], nextObjectives: Objective[]): boolean => {
    if (prevObjectives.length !== nextObjectives.length) {
        return false
    }
    return prevObjectives.every((objective, index) => objective.obtained === nextObjectives[index]?.obtained)
}

const ShipDashBoard = memo(({ ship, mapOpen, setMapOpen, objectives }: Props) => {
    return (
        <div className="panel-frame dashboard-panel">
            <div>
                <p>
                    damage: {ship.damage} / {ship.profile.maxHp}
                </p>
                <p>
                    Speed: {ship.speedLastTurn.toFixed(2)}
                </p>
                <button onClick={() => setMapOpen(!mapOpen)}>map</button>
            </div>
            {!!(objectives.length) && (
                <table>
                    <tbody>
                        {objectives.map((objective, index) => (
                            <tr key={index}>
                                <td>{objective.name}</td>
                                <td>{objective.obtained ? '☑' : '☐'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}, ((prevProps, nextProps) => {
    return (
        prevProps.ship.speedLastTurn === nextProps.ship.speedLastTurn &&
        prevProps.ship.damage === nextProps.ship.damage &&
        prevProps.ship.profile.maxHp === nextProps.ship.profile.maxHp &&
        prevProps.mapOpen === nextProps.mapOpen &&
        objectivesAreEqual(prevProps.objectives, nextProps.objectives)
    )
}))

export { ShipDashBoard }