import { SoundDeck } from "sound-deck"
import { Scenario } from "../../scenarios"
import { buildMatrixFromGameState } from "../../lib/path-finding/build-matrix"
import { BuccaneerGame } from "../BuccaneerGame"

type Props = {
    scenario: Scenario
    soundDeck: SoundDeck
}

export const ScenarioGame = ({ scenario, soundDeck }: Props) => {
    const gameState = scenario.makeInitialState()
    const { landAndForts, land } = buildMatrixFromGameState(gameState)
    return (
        <BuccaneerGame
            initial={gameState}
            obstacleMatrix={landAndForts}
            landMatrix={land}
            soundDeck={soundDeck}
        />)
}
