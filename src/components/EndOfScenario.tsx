import { useManagement } from "../context/management-context";
import { ScenarioOutcome } from "../scenarios";

interface Props {
    outcome: ScenarioOutcome
}

export const EndOfScenario = ({ outcome }: Props) => {

    const { reportOutcome } = useManagement()

    return (
        <div className="dialog">
            {outcome.message}
            <button onClick={() => { reportOutcome(outcome) }}>ok</button>
        </div>
    )
}