import { useState } from "react"
import { Scenario } from "../../scenarios"
import { Modal } from "../Modal"
import { BlueskyButton } from "../promotion/BlueskyButton"
import { About } from "../promotion/About"

type Props = {
    setScenario: { (scenario: Scenario): void }
    scenarios: Record<string, Scenario>
}

export const TitleScreen = ({ setScenario, scenarios }: Props) => {

    const [aboutModalOpen, setAboutModalOpen] = useState(false)

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
                </div>
                <div className="button-row">
                    <button onClick={() => setAboutModalOpen(true)}>about this game</button>
                    <BlueskyButton label="Share on Bluesky" postText={'Play Buccaneer!'} />
                </div>
            </main>
            <Modal title="About Buccaneer" isOpen={aboutModalOpen} setIsOpen={() => setAboutModalOpen(false)}>
                <About />
            </Modal>
        </div>
    )
}