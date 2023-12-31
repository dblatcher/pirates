import { Scenario } from "../../initial-conditions"

type Props = {
    setScenario: { (scenario: Scenario): void }
    scenarios: Record<string, Scenario>
}

export const TitleScreen = ({ setScenario, scenarios }: Props) => {

    return (
        <main className="title-screen">
            <h1>Bucaneer</h1>
            {Object.entries(scenarios).map(([key, scenario]) => (
                <button key={key} onClick={() => {
                    setScenario(scenario)
                }}>{scenario.name ?? key}</button>
            ))}
        </main>
    )
}