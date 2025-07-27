import { NoiseConfig, ToneConfig } from "sound-deck";
import { XY } from "typed-geometry";


const SUDDEN: ToneConfig['playPattern'] = [
    { time: 0, vol: .2 },
    { time: 0.1, vol: 1 },
    { time: 1, vol: .1 },
];

const RUMBLE: ToneConfig['playPattern'] = [
    { time: 0, vol: .25 },
    { time: 0.05, vol: 1.5 },
    { time: 0.1, vol: 1 },
    { time: 0.15, vol: 1.5 },
    { time: 0.2, vol: 1 },
    { time: 1, vol: .2 },
]

export type SoundEffect = {
    tone?: ToneConfig
    noise?: NoiseConfig
}

const cannonFire: SoundEffect = {
    noise: {
        duration: .5, frequency: 300,  playPattern: RUMBLE
    }
}

const shipHit: SoundEffect = {
    tone: { duration: .05, frequency: 240, playPattern: SUDDEN, type:'square'},
    noise: { duration: .6, frequency: 400, playPattern: SUDDEN },
}

const shipSink: SoundEffect = {
    tone: { duration: 1.5, frequency: 500, endFrequency: 100, volume: .5 },
    noise: {
        volume: .55,
        duration: 1.25, frequency: 2000, playPattern: [
            { time: 0, vol: .5 },
            { time: 0.1, vol: 1 },
            { time: 1, vol: .1 },
        ]
    }
}

const splash: SoundEffect = {
    noise: {
        volume: .25,
        duration: .5, frequency: 2000, playPattern: SUDDEN
    }
}

const thud: SoundEffect = {
    noise: {
        volume: .5,
        duration: .4, frequency: 200, playPattern: RUMBLE
    },
}

const ding: SoundEffect = {
    tone: { duration: .5, frequency: 1800, endFrequency: 2200, type: 'triangle' }
}

export const soundEffects = {
    cannonFire,
    shipHit,
    shipSink,
    splash,
    ding,
    thud,
}

type SfxId = keyof typeof soundEffects

export type SoundEffectRequest = {
    position: XY,
    sfx: SfxId,
}