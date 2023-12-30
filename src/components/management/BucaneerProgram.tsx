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

type Props = {

}

export const BucaneerProgram = ({ }: Props) => {
    const [scenario, setScenario] = useState<Scenario | undefined>()
    const [menuIsOpen, setMenuIsOpen] = useState(false)
    const [restartTimestamp, setRestartTimestamp] = useState(Date.now())
    const soundDeck = new SoundDeck()

    return <div>
        <SoundToggle soundDeck={soundDeck} />
        <KeyboardControls keyDownFunction={({ code }) => {
            switch (code) {
                case 'Equal':
                    return toggleSoundDeck(soundDeck)()
                case 'Escape':
                    return setMenuIsOpen(!menuIsOpen)
            }
        }} />
        <button onClick={() => { setMenuIsOpen(!menuIsOpen) }}> main menu</button>

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

        <Modal setIsOpen={setMenuIsOpen} isOpen={menuIsOpen} >
            <MainMenu
                quitToTitle={() => {
                    setScenario(undefined)
                    setMenuIsOpen(false)
                }}
                restartGame={() => { setRestartTimestamp(Date.now()) }}
            />
        </Modal>
    </div>
}