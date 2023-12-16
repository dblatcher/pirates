import { ToneParams } from "sound-deck";
import { XY } from "../../lib/geometry";


export type SoundEffect = {
    tone: ToneParams
}

const cannonFire: SoundEffect = {
    tone: { duration: .05, frequency: 400, endFrequency: 500, type: 'square' }
}

const shipHit: SoundEffect = {
    tone: { duration: .05, frequency: 400 }
}

const shipSink: SoundEffect = {
    tone: { duration: 1.5, frequency: 500, endFrequency: 200 }
}

export const soundEffects = {
    cannonFire,
    shipHit,
    shipSink,
}

type SfxId = keyof typeof soundEffects

export type SoundEffectRequest = {
    position: XY,
    sfx: SfxId,
}