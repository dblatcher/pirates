import { SoundDeck } from "sound-deck"
import { Scenario } from "../../scenarios"
import { buildMatrixFromGameState } from "../../lib/path-finding/build-matrix"
import { BuccaneerGame } from "../BuccaneerGame"
import { useMemo } from "react"

type Props = {
    scenario: Scenario
    soundDeck: SoundDeck
}

export const ScenarioGame = ({ scenario, soundDeck }: Props) => {
    const initialState = useMemo(() => scenario.makeInitialState(), [scenario])
    const { land, landWithBuffer, landAndForts } = useMemo(() => buildMatrixFromGameState(initialState), [initialState])
    return (
        <BuccaneerGame
            initial={initialState}
            landAndFortsMatrix={landAndForts}
            paddedObstacleMatrix={landWithBuffer}
            landMatrix={land}
            soundDeck={soundDeck}
        />)
}
