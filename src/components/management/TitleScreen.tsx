import { ReactNode, useState } from "react"
import { Scenario } from "../../scenarios"
import { Modal } from "../Modal"
import { About } from "../promotion/About"
import { BlueskyButton } from "../promotion/BlueskyButton"
import { useBgm } from "../../hooks/use-bgm"
import { SoundDeck } from "sound-deck"

type Props = {
    setScenario: { (scenario: Scenario): void }
    scenarios: Record<string, Scenario>
    children?: ReactNode
    soundDeck: SoundDeck,
}

export const TitleScreen = ({ setScenario, scenarios, children, soundDeck }: Props) => {

    useBgm('blow-the-man-down', false, soundDeck)

    const [aboutModalOpen, setAboutModalOpen] = useState(false)
    return (
        <div className="scrolling-container">
            <main className="paper">
                <div className="title-screen skull-stamp">
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
                        <BlueskyButton label="Share on Bluesky" postText={'Play #Buccaneer, the ad-free browser game of naval combat!'} />
                    </div>
                </div>
            </main>
            <nav className="top-menu-bar-fixed">
                {children}
            </nav>
            <Modal title="About Buccaneer"
                scrollable
                isOpen={aboutModalOpen}
                setIsOpen={() => setAboutModalOpen(false)}>
                <About />
            </Modal>
        </div>
    )
}