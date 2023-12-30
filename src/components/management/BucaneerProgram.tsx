import { useState } from "react"
import { SoundDeck } from "sound-deck"
import { Scenario, scenarios } from '../../initial-conditions'
import { toggleSoundDeck } from "../../lib/sounds"
import { KeyboardControls } from "../KeyboardControls"
import { SoundToggle } from "../SoundToggle"
import { ScenarioGame } from "./ScenarioGame"
import { TitleScreen } from "./TitleScreen"
import { MainMenu } from "./MainMenu"
import { Modal } from "./Modal"
import { ManagementProvider } from "../../context/management-context"

export const BucaneerProgram = () => {
    const [scenario, setScenario] = useState<Scenario | undefined>()
    const [mainMenuOpen, setMainMenuOpen] = useState(false)
    const [restartTimestamp, setRestartTimestamp] = useState(Date.now())
    const soundDeck = new SoundDeck()

    return (
        <ManagementProvider value={{
            mainMenuOpen, scenario
        }}>
            <SoundToggle soundDeck={soundDeck} />
            <KeyboardControls keyDownFunction={({ code }) => {
                switch (code) {
                    case 'Equal':
                        return toggleSoundDeck(soundDeck)()
                    case 'Escape':
                        return setMainMenuOpen(!mainMenuOpen)
                }
            }} />
            <button onClick={() => { setMainMenuOpen(!mainMenuOpen) }}> main menu</button>

            {scenario ? (
                <ScenarioGame
                    soundDeck={soundDeck}
                    scenario={scenario}
                    key={restartTimestamp} />
            ) : (
                <TitleScreen
                    setScenario={setScenario}
                    scenarios={scenarios} />
            )}

            <Modal setIsOpen={setMainMenuOpen} isOpen={mainMenuOpen} >
                <MainMenu
                    quitToTitle={() => {
                        setScenario(undefined)
                        setMainMenuOpen(false)
                    }}
                    restartGame={() => { setRestartTimestamp(Date.now()) }}
                />
            </Modal>
        </ManagementProvider>
    )
}