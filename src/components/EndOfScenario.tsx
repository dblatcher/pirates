import { useManagement } from "../context/management-context";
import { ScenarioOutcome } from "../initial-conditions";

interface Props {
    outcome: ScenarioOutcome
}

export const EndOfScenario = ({ outcome }: Props) => {

    const { reportOutcome } = useManagement()

    return (
        <div className="panel-frame">
            {outcome.message}
            <button onClick={() => { reportOutcome(outcome) }}>ok</button>
        </div>
    )
}