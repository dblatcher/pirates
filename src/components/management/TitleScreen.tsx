import { ReactNode, useState } from "react"
import { Scenario } from "../../scenarios"
import { Modal } from "../Modal"
import { About } from "../promotion/About"
import { BlueskyButton } from "../promotion/BlueskyButton"
import { useBgm } from "../../hooks/use-bgm"
import { SoundDeck } from "sound-deck"
import { SongKey } from "../../lib/songs"
import { IconButton } from "../IconButton"

type Props = {
    setScenario: { (scenario: Scenario): void }
    scenarios: Record<string, Scenario>
    children?: ReactNode
    soundDeck: SoundDeck,
}


export const TitleScreen = ({ setScenario, scenarios, children, soundDeck }: Props) => {

    const [playSong, setPlaySong] = useState<SongKey>()
    useBgm(playSong, false, soundDeck)

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
                    <div className="button-row">
                        <IconButton icon='music' onClick={() => setPlaySong('blow-the-man-down')} label="blow-the-man-down"/>
                        <IconButton icon='music' onClick={() => setPlaySong('drunken-sailor')} label="drunken-sailor"/>
                        <IconButton icon='music' negate onClick={() => setPlaySong(undefined)} label="off"/>
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