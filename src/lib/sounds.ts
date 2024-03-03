import { SoundDeck } from "sound-deck";
import { SoundEffectRequest, soundEffects } from "../game-state/model/sound";
import { ViewPort } from "../game-state";
import { viewPortToRect } from "../game-state/helpers";
import { isPointInsideRect } from "./geometry";


export const playSoundEffectsInView = (soundEffectRequests: SoundEffectRequest[], soundDeck: SoundDeck, viewPort: ViewPort) => {
    const { isEnabled, isMuted } = soundDeck
    if (!isEnabled || isMuted) {
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

export const makeTalkSound = (soundDeck: SoundDeck) => {
    const { isEnabled, isMuted } = soundDeck
    if (!isEnabled || isMuted) {
        return
    }

    const frequency = 200 + Math.floor(Math.random() * 100)
    const duration = (75 + Math.floor(Math.random() * 50)) / 1000

    soundDeck.playTone({
        duration,
        frequency: frequency,
        endFrequency: frequency + 60,
        type: 'sawtooth',
    }, { volume: .1 })
}
