import { useState } from "react"
import { SoundDeck } from "sound-deck"
import { ManagementProvider } from "../../context/management-context"
import { Scenario, ScenarioOutcome, scenarios, startingScenarios } from '../../scenarios'
import { IconButton } from "../IconButton"
import { KeyboardControls } from "../KeyboardControls"
import { Layout } from "../Layout"
import { SoundToggle } from "../SoundToggle"
import { MainMenu } from "./MainMenu"
import { ScenarioGame } from "./ScenarioGame"
import { TitleScreen } from "./TitleScreen"

export const BuccaneerProgram = () => {
    const [scenario, setScenario] = useState<Scenario | undefined>()
    const [mainMenuOpen, setMainMenuOpen] = useState(false)
    const [gameIsPaused, setGameIsPaused] = useState(false)
    const [cyclePeriod, setCyclePeriod] = useState(10)
    const [gameTimeStamp, setGameTimeStamp] = useState(Date.now())
    const [soundDeck] = useState(new SoundDeck())
    //changes to soundDeck.isEnabled are not reactive - use separate state to track for the UI
    const [soundIsEnabled, setSoundIsEnabled] = useState(soundDeck.isEnabled)
    const resetScenario = () => setGameTimeStamp(Date.now())

    const toggleSound = async () => {
        if (!soundDeck.isEnabled) {
            await soundDeck.enable()
            setSoundIsEnabled(true)
            soundDeck.playTone({ frequency: 2000, type: 'square', endFrequency: 3000, duration: .25 }, { volume: .1 })
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
            mainMenuOpen, scenario, soundIsEnabled, toggleSound, reportOutcome, gameIsPaused, cyclePeriod
        }}>
            <KeyboardControls keyDownFunction={({ code }) => {
                switch (code) {
                    case 'Equal':
                        return toggleSound()
                    case 'Escape':
                        return setMainMenuOpen(!mainMenuOpen)
                    case 'KeyP':
                        return setGameIsPaused(!gameIsPaused)
                }
            }} />
            <Layout
                topMenu={
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}>
                        {!!scenario && (<>
                            <IconButton
                                onClick={() => { setMainMenuOpen(!mainMenuOpen) }}
                                icon="⚙️" />
                            <IconButton
                                onClick={() => { setGameIsPaused(!gameIsPaused) }}
                                icon={gameIsPaused ? "⏯️" : "⏸️"} />
                            <IconButton
                                onClick={() => { setCyclePeriod(cyclePeriod === 10 ? 0 : 10) }}
                                icon={cyclePeriod === 10 ? "▶️" : "⏩"} />
                        </>)}
                        <SoundToggle />
                    </div>
                }
            >
                {scenario ? (<>
                    <ScenarioGame
                        soundDeck={soundDeck}
                        scenario={scenario}
                        key={gameTimeStamp} />
                    <MainMenu setIsOpen={setMainMenuOpen} isOpen={mainMenuOpen}
                        quitToTitle={() => {
                            setScenario(undefined)
                            setGameIsPaused(false)
                            setMainMenuOpen(false)
                        }}
                        restartGame={() => {
                            setGameIsPaused(false)
                            setMainMenuOpen(false)
                            resetScenario()
                        }}
                    />
                </>) : (
                    <TitleScreen
                        setScenario={setScenario}
                        scenarios={startingScenarios} />
                )}
            </Layout>
        </ManagementProvider>
    )
}