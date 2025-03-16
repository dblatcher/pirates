import { useState } from "react"
import { Scenario } from "../../scenarios"
import { Modal } from "../Modal"
import { About } from "../promotion/About"
import { BlueskyButton } from "../promotion/BlueskyButton"

type Props = {
    setScenario: { (scenario: Scenario): void }
    scenarios: Record<string, Scenario>
    screenWidth?: number
}

export const TitleScreen = ({ setScenario, scenarios, screenWidth }: Props) => {

    const [aboutModalOpen, setAboutModalOpen] = useState(false)
    return (
        <div className="paper" style={{ margin: '0 auto' }}>
            <main className="title-screen skull-stamp">
                <h1>Buccaneer</h1>
                {!!screenWidth && screenWidth < 600 && (
                    <div className="warning-message">
                        This game is not intended for mobile devices!
                    </div>
                )}
                <div className="button-stack">
                    {Object.entries(scenarios).map(([key, scenario]) => (
                        <button key={key} onClick={() => {
                            setScenario(scenario)
                        }}>{scenario.name ?? key}</button>
                    ))}
                </div>
                <div className="button-row">
                    <button onClick={() => setAboutModalOpen(true)}>about this game</button>
                    <BlueskyButton label="Share on Bluesky" postText={'Play #Buccaneer, the ad-free browser game of naval combat!'} />
                </div>
            </main>
            <Modal title="About Buccaneer" isOpen={aboutModalOpen} setIsOpen={() => setAboutModalOpen(false)}>
                <About />
            </Modal>
        </div>
    )
}