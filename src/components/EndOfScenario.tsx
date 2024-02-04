import { useManagement } from "../context/management-context";
import { ScenarioOutcome } from "../scenarios";

interface Props {
    outcome: ScenarioOutcome
}

export const EndOfScenario = ({ outcome }: Props) => {

    const { reportOutcome } = useManagement()

    return (
        <div className="paper">
            <h2>{outcome.success ? "Success!" : "Failure!"}</h2>
            <p>{outcome.message}</p>
            <div>
                <button onClick={() => { reportOutcome(outcome) }}>ok</button>
            </div>
        </div>
    )
}