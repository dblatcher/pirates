import { useState } from "react"
import { SoundDeck } from "sound-deck"
import * as scenarios from '../initial-conditions'
import { Scenario } from "../initial-conditions"
import { buildMatrixFromGameState } from "../lib/path-finding/build-matrix"
import { BuccaneerGame } from "./BucaneerGame"
import { SoundToggle } from "./SoundToggle"
import { KeyboardControls } from "./KeyboardControls"
import { toggleSoundDeck } from "../lib/sounds"

type Props = {

}

const ScenarioGame = (props: { scenario: Scenario, soundDeck: SoundDeck }) => {
    const { mapHeight, mapWidth } = props.scenario
    const gameState = props.scenario.makeInitialState()
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
    const [scenario, setScenario] = useState<Scenario | undefined>()
    const soundDeck = new SoundDeck()

    return <div>
        <SoundToggle soundDeck={soundDeck} />
        <KeyboardControls keyDownFunction={({ code }) => {
            switch (code) {
                case 'Equal':
                    return toggleSoundDeck(soundDeck)()
                case 'Escape':
                    return setScenario(undefined)
            }
        }} />
        <button onClick={() => {
            setScenario(undefined)
        }}>reset</button>

        {scenario ? (
            <ScenarioGame soundDeck={soundDeck} scenario={scenario} />
        ) : (
            <>
                <h1>Title screen</h1>
                {Object.entries(scenarios).map(([key, scenario]) => (
                    <button key={key} onClick={() => {
                        setScenario(scenario)
                    }}>{scenario.name ?? key}</button>
                ))}
            </>
        )}
    </div>
}