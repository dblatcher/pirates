import { memo } from "react";
import { Objective } from "../../game-state";

interface Props {
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

const ShipDashBoard = memo(({ mapOpen, setMapOpen, objectives }: Props) => {
    return (
        <div className="panel-frame dashboard-panel">
            <div>
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
        prevProps.mapOpen === nextProps.mapOpen &&
        objectivesAreEqual(prevProps.objectives, nextProps.objectives)
    )
}))

export { ShipDashBoard }