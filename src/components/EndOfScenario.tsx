import { CSSProperties } from "react";
import { useManagement } from "../context/management-context";
import { ScenarioOutcome } from "../scenarios";
import { BlueskyButton } from "./promotion/BlueskyButton";
import { cornerOverlay } from "../lib/style-helpers";

interface Props {
    outcome: ScenarioOutcome
}

const buttonContainerStyle: CSSProperties = {
    fontSize: '200%',
    display: 'flex',
    justifyContent: 'space-evenly',
    gap: 15,
    paddingBottom: 10,
}

export const EndOfScenario = ({ outcome }: Props) => {
    const { reportOutcome, scenario } = useManagement()

    const shareMessage = scenario?.getShareMessage?.(outcome);

    const buttonText = outcome.success ? outcome.exitToTitle ? 'fin' : 'next misson' : 'try again'
    return (
        <div className="paper no-select-highlight" style={{ minWidth: 200, textAlign: 'center', position: 'relative' }}>
            <h2>{outcome.success ? "Success!" : "Failure!"}</h2>
            <p>{outcome.message}</p>
            <div style={buttonContainerStyle}>
                <button
                    onClick={() => { reportOutcome(outcome) }}
                    className="scrawl-button"
                >{buttonText}</button>
            </div>
            {shareMessage && (
                <BlueskyButton
                    style={{
                        ...cornerOverlay('bottom', 'right', 10)

                    }}
                    format="round"
                    postText={shareMessage.postText}
                    label="share on Bluesky"
                />
            )}
        </div>
    )
}