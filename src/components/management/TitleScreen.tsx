import { CANONICAL_URL } from "../../admin-constants"
import { Scenario } from "../../scenarios"
import { BlueskyButton } from "../promotion/BlueSkyButton"

type Props = {
    setScenario: { (scenario: Scenario): void }
    scenarios: Record<string, Scenario>
}

const postText = `play Buccaneer! ${CANONICAL_URL}`

export const TitleScreen = ({ setScenario, scenarios }: Props) => {
    return (
        <div className="paper" style={{ margin: '0 auto' }}>
            <main className="title-screen skull-stamp">
                <h1>Buccaneer</h1>
                <div className="button-stack">
                    {Object.entries(scenarios).map(([key, scenario]) => (
                        <button key={key} onClick={() => {
                            setScenario(scenario)
                        }}>{scenario.name ?? key}</button>
                    ))}
                    <BlueskyButton label="Share on Bluesky" postText={postText}/>
                </div>
            </main>
        </div>
    )
}