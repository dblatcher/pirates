import { Scenario } from "../../initial-conditions"

type Props = {
    setScenario: { (scenario: Scenario): void }
    scenarios: Record<string, Scenario>
}

export const TitleScreen = ({ setScenario, scenarios }: Props) => {

    return (
        <>
            <h1>Bucaneer</h1>
            {Object.entries(scenarios).map(([key, scenario]) => (
                <button key={key} onClick={() => {
                    setScenario(scenario)
                }}>{scenario.name ?? key}</button>
            ))}
            <img src={'./jolly-rodger.png'} style={{ position: 'fixed', right: 0, top: 0, zIndex: -1, width: "40%" }} />
        </>
    )
}