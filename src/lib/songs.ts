import { Instrument, parseStaveNotes, presetNoises, presetTones, PitchedNote } from "sound-deck";

type StaveNote = {
    note?: PitchedNote;
    beats: number;
    atBeat: number;
};

type Stave = {
    instrument: Instrument;
    notes: StaveNote[];
    volume?: number;
};

export const BOING: Instrument = {
    soundType: 'tone',
    ...presetTones.SPRINGY_BOUNCE
}

export const BELL: Instrument = {
    soundType: 'tone',
    ...presetTones.NEUTRAL_BELL
}

export const SNARE: Instrument = {
    soundType: 'noise',
    ...presetNoises.TAP,
}

export const DRUM: Instrument = {
    soundType: 'noise',
    ...presetNoises.SNAP,
}


const beatFourFour = parseStaveNotes("C6...-...F...C...".repeat(8))

const drunkenSailorTrebleString = `
A4.AA A.AA | A.D. F. A. | G.GG  G.GG | G.C. E.G.|
A4.AA A.AA | A.B. C5.D. | C.A4. G.E. | D... D...|
 A... A..A | A.D. F. A. | G...  G..G | G.C. E.G.|
 A... A..A | A.B. C5.D. | C.A4. G.E. | D... D...|
`

const drunkenSailorBaseString = `
D2.D3.A2.D3.|D2.D3.A2.D3.|C2.C3.G2.C3.|C2.C3.G2.C3.|
D2.D3.A2.D3.|D2.D3.A2.D3.|F2.F3.C2.C3.|D2.D3.A2.D3.|
D2.D3.A2.D3.|D2.D3.A2.D3.|C2.C3.G2.C3.|C2.C3.G2.C3.|
D2.D3.A2.D3.|D2.D3.A2.D3.|F2.F3.C2.C3.|D2.D3.A2...|`

const drunkenSailorTreble = parseStaveNotes(drunkenSailorTrebleString);
const drunkenSailorBase = parseStaveNotes(drunkenSailorBaseString)
const drunkenSailorBaseHigher = parseStaveNotes(drunkenSailorBaseString.replace(/3/g, "4").replace(/2/g, "3"))


const blowTheManDownString = `
G.....A.G...|E...C...E...|G...A...G...|E...........|G...........|A...........|F.....E.F...|D...........|
F.....E.F...|D...D...D...|F...G...F...|D...........|G...G...G...|G.......F...|E.....D.E...|C...........|
`;
const blowTheManDown = parseStaveNotes(blowTheManDownString)

const beatThreeFour = parseStaveNotes("C4...G4...C4.C4.".repeat(16))


export type SongKey = 'drunken-sailor' | 'blow-the-man-down'

export const songs: Record<SongKey, { staves: Stave[], tempo?: number }> = {

    'drunken-sailor': {
        staves: [
            { instrument: BELL, notes: drunkenSailorTreble, volume: .5 },
            { instrument: BOING, notes: drunkenSailorBase, volume: .025 },
            { instrument: BOING, notes: drunkenSailorBaseHigher, volume: .025 },
            { instrument: SNARE, notes: beatFourFour, volume: 1 }
        ],
        tempo: 2.5
    },
    'blow-the-man-down': {
        staves: [
            { instrument: BOING, notes: blowTheManDown, volume: .5 },
            { instrument: DRUM, notes: beatThreeFour, volume: 1 },
        ],
        tempo: 5
    }
}

export const deathJingle: Stave[] = [
    {
        instrument: BELL,
        notes: parseStaveNotes('C3 Eb C. G2. Eb3 | C3 Eb C3 Eb C...')
    }
]
