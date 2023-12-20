import { useState } from "react"
import * as scenarios from '../initial-conditions'
import { InitialConditions } from "../game-state"
import { buildMatrixFromGameState } from "../lib/path-finding/build-matrix"
import { BuccaneerGame } from "./BucaneerGame"
import { SoundDeck } from "sound-deck"
import { SoundToggle } from "./SoundToggle"

type Props = {

}

const ScenarioGame = (props: { scenario: InitialConditions, soundDeck: SoundDeck }) => {
    const { gameState, mapHeight, mapWidth } = props.scenario
    const { landAndForts, land } = buildMatrixFromGameState(mapWidth, mapHeight, gameState)
    return (
        <BuccaneerGame
            initial={gameState}
            obstacleMatrix={landAndForts}
            landMatrix={land}
            mapHeight={mapHeight}
            mapWidth={mapWidth}
            soundDeck={props.soundDeck}
        />)
}


export const MainMenu = ({ }: Props) => {
    const [scenario, setScenario] = useState<InitialConditions | undefined>()
    const soundDeck = new SoundDeck()

    return <div>
        <SoundToggle soundDeck={soundDeck} />
        <button onClick={() => {
            setScenario(undefined)
        }}>reset</button>

        {scenario ? (
            <ScenarioGame soundDeck={soundDeck} scenario={scenario} />
        ) : (
            <>
                <h1>Title screen</h1>
                <button onClick={() => {
                    setScenario(scenarios.aiTrial)
                }}>aiTrial</button>
                <button onClick={() => {
                    setScenario(scenarios.demoOne)
                }}>demoOne</button>
                <button onClick={() => {
                    setScenario(scenarios.bigMesseyBattle)
                }}>bigMesseyBattle</button>
            </>
        )}
    </div>
}