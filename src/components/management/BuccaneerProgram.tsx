import { useRef, useState } from "react"
import { SoundDeck } from "sound-deck"
import { Scenario, ScenarioOutcome, scenarios, startingScenarios } from '../../initial-conditions'
import { KeyboardControls } from "../KeyboardControls"
import { SoundToggle } from "../SoundToggle"
import { ScenarioGame } from "./ScenarioGame"
import { TitleScreen } from "./TitleScreen"
import { MainMenu } from "./MainMenu"
import { Modal } from "./Modal"
import { ManagementProvider } from "../../context/management-context"
import { IconButton } from "../IconButton"

export const BuccaneerProgram = () => {
    const [scenario, setScenario] = useState<Scenario | undefined>()
    const [mainMenuOpen, setMainMenuOpen] = useState(false)
    const [gameTimeStamp, setGameTimeStamp] = useState(Date.now())
    const soundDeckRef = useRef(new SoundDeck())
    const [soundIsEnabled, setSoundIsEnabled] = useState(soundDeckRef.current.isEnabled)

    const resetScenario = () => setGameTimeStamp(Date.now())

    // TO DO - toggling the sound causes a re-render, so the game does the matrix again. Can it not?
    const toggleSound = async () => {
        const soundDeck = soundDeckRef.current
        if (!soundIsEnabled) {
            await soundDeck.enable()
            soundDeck.playTone({ frequency: 2000, type: 'square', endFrequency: 3000, duration: .25 }, { volume: .1 })
            setSoundIsEnabled(true)
        } else {
            await soundDeck.disable()
            setSoundIsEnabled(false)
        }
    }

    const reportOutcome = (outcome: ScenarioOutcome) => {
        if (outcome.success === false) {
            return resetScenario()
        }
        if (outcome.nextScenarioId) {
            const maybeScenario = scenarios[outcome.nextScenarioId]
            if (!maybeScenario) {
                return console.warn(`no scenario called ${outcome.nextScenarioId}`)
            }
            setScenario(maybeScenario)
            return resetScenario()
        }
        return console.warn(`Success outcome has no next scenario`)
    }

    return (
        <ManagementProvider value={{
            mainMenuOpen, scenario, soundIsEnabled, toggleSound, reportOutcome
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
            }}>
                {!!scenario && (
                    <IconButton
                        onClick={() => { setMainMenuOpen(!mainMenuOpen) }}
                        icon="⚙️" />
                )}
                <SoundToggle />
            </div>
            <KeyboardControls keyDownFunction={({ code }) => {
                switch (code) {
                    case 'Equal':
                        return toggleSound()
                    case 'Escape':
                        return setMainMenuOpen(!mainMenuOpen)
                }
            }} />

            {scenario ? (
                <ScenarioGame
                    soundDeck={soundDeckRef.current}
                    scenario={scenario}
                    key={gameTimeStamp} />
            ) : (
                <TitleScreen
                    setScenario={setScenario}
                    scenarios={startingScenarios} />
            )}

            <Modal setIsOpen={setMainMenuOpen} isOpen={mainMenuOpen} >
                <MainMenu
                    quitToTitle={() => {
                        setScenario(undefined)
                        setMainMenuOpen(false)
                    }}
                    restartGame={() => {
                        resetScenario()
                        setMainMenuOpen(false)
                    }}
                />
            </Modal>
        </ManagementProvider>
    )
}