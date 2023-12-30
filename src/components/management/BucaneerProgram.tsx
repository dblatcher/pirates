import { useState } from "react"
import { SoundDeck } from "sound-deck"
import { Scenario, scenarios } from '../../initial-conditions'
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
    const [soundIsEnabled, setSoundIsEnabled] = useState(soundDeck.isEnabled)

    const toggleSound = async () => {
        if (!soundIsEnabled) {
            await soundDeck.enable()
            soundDeck.playTone({ frequency: 2000, type: 'square', endFrequency: 3000, duration: .25 }, { volume: .1 })
            setSoundIsEnabled(true)
        } else {
            await soundDeck.disable()
            setSoundIsEnabled(false)
        }
    }

    // TO DO - toggling the sound causes a re-render, so the game does the matrix again. Can it not?

    return (
        <ManagementProvider value={{
            mainMenuOpen, scenario, soundIsEnabled, toggleSound
        }}>
            <SoundToggle />
            <KeyboardControls keyDownFunction={({ code }) => {
                switch (code) {
                    case 'Equal':
                        return toggleSound()
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
                    restartGame={() => {
                        setRestartTimestamp(Date.now())
                        setMainMenuOpen(false)
                    }}
                />
            </Modal>
        </ManagementProvider>
    )
}