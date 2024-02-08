import { CSSProperties } from "react"
import { Scenario } from "../../scenarios"

type Props = {
    setScenario: { (scenario: Scenario): void }
    scenarios: Record<string, Scenario>
}

const titleScreenStyle: CSSProperties = {
    padding: '10px 90px 120px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
}

export const TitleScreen = ({ setScenario, scenarios }: Props) => {
    return (
        <div className="paper" style={{ margin: '0 auto' }}>
            <main className="title-screen skull-stamp" style={titleScreenStyle}>
                <h1>Buccaneer</h1>
                <div className="button-stack">
                    {Object.entries(scenarios).map(([key, scenario]) => (
                        <button key={key} onClick={() => {
                            setScenario(scenario)
                        }}>{scenario.name ?? key}</button>
                    ))}
                </div>
            </main>
        </div>
    )
}