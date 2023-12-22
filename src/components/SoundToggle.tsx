import { useState } from "react";
import { SoundDeck } from "sound-deck";
import { toggleSoundDeck } from "../lib/sounds";
import { useInterval } from "../hooks/useInterval";

interface Props {
    soundDeck: SoundDeck
}


export const SoundToggle = ({ soundDeck }: Props) => {

    const [isEnabled, setEnabled] = useState(soundDeck.isEnabled)

    // TO DO - provide soundDeck through a context so 
    // the component can be reactive to changes 
    useInterval(() => {
        setEnabled(soundDeck.isEnabled)
    }, 100)

    return <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
    }}>
        <button onClick={toggleSoundDeck(soundDeck)}>
            <div className="sound-icon">
                {isEnabled ? <i>🔊</i> : <i>🔇</i>}
            </div>
        </button>
    </div>
} 