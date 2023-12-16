import { NoiseParams, ToneParams } from "sound-deck";
import { XY } from "../../lib/geometry";


export type SoundEffect = {
    tone?: ToneParams
    noise?: NoiseParams
}

const cannonFire: SoundEffect = {
    tone: { duration: .025, frequency: 60, endFrequency: 400, type: 'square' }
}

const shipHit: SoundEffect = {
    tone: { duration: .03, frequency: 400 },
    noise: { duration: .6, frequency: 400 },
}

const shipSink: SoundEffect = {
    tone: { duration: 1.5, frequency: 500, endFrequency: 100 }
}

const splash: SoundEffect = {
    noise: { duration: .3, frequency: 2000 }
}

export const soundEffects = {
    cannonFire,
    shipHit,
    shipSink,
    splash,
}

type SfxId = keyof typeof soundEffects

export type SoundEffectRequest = {
    position: XY,
    sfx: SfxId,
}