import { useState } from "react"
import { SoundDeck } from "sound-deck"
import { assetParams } from "../../assets"
import { WaitingAssetProvider } from "../../context/asset-context"
import { ManagementProvider } from "../../context/management-context"
import { WindowSizeContext } from "../../context/window-size-context"
import { useWindowSize } from "../../hooks/useWindowSize"
import { probablyMobile } from "../../lib/screen-helpers"
import { ControlMode } from "../../lib/types"
import { Scenario, ScenarioOutcome, scenarios, startingScenarios } from '../../scenarios'
import { IconButton } from "../IconButton"
import { KeyboardControls } from "../KeyboardControls"
import { SoundToggle } from "../SoundToggle"
import { MainMenu } from "./MainMenu"
import { ScenarioGame } from "./ScenarioGame"
import { TitleScreen } from "./TitleScreen"

export const BuccaneerProgram = () => {
    const { windowWidth, windowHeight } = useWindowSize()
    const [scenario, setScenario] = useState<Scenario | undefined>()
    const [mainMenuOpen, setMainMenuOpen] = useState(false)
    const [controlMode, setControlMode] = useState<ControlMode>(() => probablyMobile(windowWidth, windowHeight) ? 'touchscreen' : 'desktop')
    const [gameIsPaused, setGameIsPaused] = useState(false)
    const [cyclePeriod, setCyclePeriod] = useState(10)
    const [gameTimeStamp, setGameTimeStamp] = useState(Date.now())
    const [soundDeck] = useState(new SoundDeck())
    //changes to soundDeck.isEnabled are not reactive - use separate state to track for the UI
    const [soundIsEnabled, setSoundIsEnabled] = useState(soundDeck.isEnabled)
    const resetScenario = () => setGameTimeStamp(Date.now())

    // fairly crude, but way of controlling the scenarios on the menu, but will work for now
    const secariosToShowOnMenu = location.search.includes('all') ? scenarios : startingScenarios

    const exitToTitle = () => {
        setScenario(undefined)
        setGameIsPaused(false)
        setMainMenuOpen(false)
    }

    const toggleSound = async () => {
        if (!soundDeck.isEnabled) {
            await soundDeck.enable()
            setSoundIsEnabled(true)
            soundDeck.playTone({ frequency: 2000, type: 'square', endFrequency: 3000, duration: .25, volume: .1 })
        } else {
            await soundDeck.disable()
            setSoundIsEnabled(false)
        }
    }

    const reportOutcome = (outcome: ScenarioOutcome) => {
        if (outcome.success === false) {
            return resetScenario()
        }
        if (outcome.exitToTitle) {
            return exitToTitle()
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

    const topMenu = <>
        <SoundToggle />
        {!!scenario && (<>
            <IconButton
                onClick={() => { setGameIsPaused(!gameIsPaused) }}
                icon={'pause'}
                negate={!gameIsPaused} />
            <IconButton
                onClick={() => { setMainMenuOpen(!mainMenuOpen) }}
                icon="menu" />
        </>)}
    </>


    return (
        <WaitingAssetProvider assetParams={assetParams} loadingContent={<p>waiting for image</p>}>
            <ManagementProvider value={{
                mainMenuOpen, scenario,
                soundIsEnabled, toggleSound,
                reportOutcome,
                gameIsPaused,
                cyclePeriod, setControlMode,
                controlMode, setCyclePeriod,
            }}>
                <WindowSizeContext.Provider value={{ windowWidth, windowHeight }}>
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
                    <div className="main-layout-outer">
                        <div className="main-layout-inner">
                            {scenario ? (<>
                                <ScenarioGame
                                    soundDeck={soundDeck}
                                    scenario={scenario}
                                    key={gameTimeStamp} >
                                    {topMenu}
                                </ScenarioGame>
                                <MainMenu setIsOpen={setMainMenuOpen} isOpen={mainMenuOpen}
                                    quitToTitle={exitToTitle}
                                    restartGame={() => {
                                        setGameIsPaused(false)
                                        setMainMenuOpen(false)
                                        resetScenario()
                                    }}
                                />
                            </>) : (
                                <TitleScreen
                                    setScenario={setScenario}
                                    scenarios={secariosToShowOnMenu} >
                                    {topMenu}
                                </TitleScreen>
                            )}
                        </div>
                    </div >
                </WindowSizeContext.Provider>
            </ManagementProvider>
        </WaitingAssetProvider>
    )
}