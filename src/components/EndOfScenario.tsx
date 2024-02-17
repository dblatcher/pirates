import { CSSProperties } from "react";
import { useManagement } from "../context/management-context";
import { ScenarioOutcome } from "../scenarios";

interface Props {
    outcome: ScenarioOutcome
}

const buttonContainerStyle: CSSProperties = {
    fontSize: '200%',
    display: 'flex',
    justifyContent: 'space-evenly',
    gap: 15,
    paddingBottom: 10
}

export const EndOfScenario = ({ outcome }: Props) => {
    const { reportOutcome } = useManagement()
    const buttonText = outcome.exitToTitle ? 'fin' : 'next misson'
    return (
        <div className="paper">
            <h2>{outcome.success ? "Success!" : "Failure!"}</h2>
            <p>{outcome.message}</p>
            <div style={buttonContainerStyle}>
                <button
                    onClick={() => { reportOutcome(outcome) }}
                    className="scrawl-button"
                >{buttonText}</button>
            </div>
        </div>
    )
}