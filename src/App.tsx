import { SoundDeck } from 'sound-deck'
import './App.css'
import { BuccaneerGame } from './components/BucaneerGame'
import * as scenarios from './initial-conditions'
import { buildMatrixFromGameState } from './lib/path-finding/build-matrix'
import { SoundToggle } from './components/SoundToggle'

const { gameState, mapHeight, mapWidth } = scenarios.demoOne
const { landAndForts, land } = buildMatrixFromGameState(mapWidth, mapHeight, gameState)

function App() {

  const soundDeck = new SoundDeck()



  return <>
    <SoundToggle soundDeck={soundDeck} />
    <BuccaneerGame
      initial={gameState}
      obstacleMatrix={landAndForts}
      landMatrix={land}
      mapHeight={mapHeight}
      mapWidth={mapWidth} />
  </>
}

export default App
