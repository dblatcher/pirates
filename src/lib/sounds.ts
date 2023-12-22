import { SoundDeck } from "sound-deck";
import { SoundEffectRequest, soundEffects } from "../game-state/model/sound";
import { ViewPort } from "../game-state";
import { viewPortToRect } from "../game-state/helpers";
import { isPointInsideRect } from "./geometry";


export const toggleSoundDeck = (soundDeck: SoundDeck) => async () => {
    if (!soundDeck.isEnabled) {
        await soundDeck.enable()
        soundDeck.playTone({ frequency: 2000, type: 'square', endFrequency: 3000, duration: .25 }, { volume: .1 })
        return true
    } else {
        await soundDeck.disable()
        return false
    }
}

export const playSoundEffectsInView = (soundEffectRequests: SoundEffectRequest[], soundDeck: SoundDeck, viewPort: ViewPort) => {
    if (!soundDeck.isEnabled) {
        return
    }
    const viewRect = viewPortToRect(viewPort)
    const soundsInView = soundEffectRequests.filter(request => isPointInsideRect(request.position, viewRect))
    soundsInView
        .forEach(sound => {
            const { tone, noise } = soundEffects[sound.sfx]
            if (tone) {
                soundDeck.playTone(tone)
            }
            if (noise) {
                soundDeck.playNoise(noise)
            }
        })

}
