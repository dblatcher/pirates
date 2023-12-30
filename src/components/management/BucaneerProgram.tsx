import { useState } from "react"
import { SoundDeck } from "sound-deck"
import { Scenario, scenarios } from '../../initial-conditions'
import { toggleSoundDeck } from "../../lib/sounds"
import { KeyboardControls } from "../KeyboardControls"
import { SoundToggle } from "../SoundToggle"
import { ScenarioGame } from "./ScenarioGame"
import { TitleScreen } from "./TitleScreen"

type Props = {

}

export const BucaneerProgram = ({ }: Props) => {
    const [scenario, setScenario] = useState<Scenario | undefined>()
    const [restartTimestamp, setRestartTimestamp] = useState(Date.now())
    const soundDeck = new SoundDeck()

    return <div>
        <SoundToggle soundDeck={soundDeck} />
        <KeyboardControls keyDownFunction={({ code }) => {
            switch (code) {
                case 'Equal':
                    return toggleSoundDeck(soundDeck)()
                case 'Escape':
                    return setScenario(undefined)
            }
        }} />
        <button onClick={() => { setScenario(undefined) }}>exit to main menu</button>
        <button onClick={() => { setRestartTimestamp(Date.now()) }}>restart Scenario</button>

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
    </div>
}