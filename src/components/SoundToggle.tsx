import { useState } from "react";
import { SoundDeck } from "sound-deck";

interface Props {
    soundDeck: SoundDeck
}


export const SoundToggle = ({ soundDeck }: Props) => {

    const [isEnabled, setEnabled] = useState(soundDeck.isEnabled)

    const toggle = async () => {
        if (!soundDeck.isEnabled) {
            setEnabled(true)
            await soundDeck.enable()
            soundDeck.playTone({ frequency: 2000, type: 'square', endFrequency: 3000, duration: .25 }, { volume: .1 })
        } else {
            setEnabled(false)
            await soundDeck.disable()
        }
    }


    return <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
    }}>
        <button onClick={toggle}>
            <div className="sound-icon">
                {isEnabled ? <i>🔊</i> : <i>🔇</i>}
            </div>
        </button>
    </div>
} 