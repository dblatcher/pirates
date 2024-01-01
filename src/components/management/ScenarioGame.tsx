import { SoundDeck } from "sound-deck"
import { Scenario } from "../../initial-conditions"
import { buildMatrixFromGameState } from "../../lib/path-finding/build-matrix"
import { BuccaneerGame } from "../BuccaneerGame"

type Props = {
    scenario: Scenario
    soundDeck: SoundDeck
}

export const ScenarioGame = ({ scenario, soundDeck }: Props) => {
    const { mapHeight, mapWidth } = scenario
    const gameState = scenario.makeInitialState()
    const { landAndForts, land } = buildMatrixFromGameState(mapWidth, mapHeight, gameState)
    return (
        <BuccaneerGame
            initial={gameState}
            obstacleMatrix={landAndForts}
            landMatrix={land}
            mapHeight={mapHeight}
            mapWidth={mapWidth}
            soundDeck={soundDeck}
        />)
}
