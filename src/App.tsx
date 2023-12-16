import './App.css'
import { BuccaneerGame } from './components/BucaneerGame'
import  * as scenarios from './initial-conditions'
import { buildMatrixFromGameState } from './lib/path-finding/build-matrix'

const { gameState, mapHeight, mapWidth } = scenarios.demoOne
const { landAndForts, land } = buildMatrixFromGameState(mapWidth, mapHeight, gameState)

function App() {
  return <BuccaneerGame
    initial={gameState}
    obstacleMatrix={landAndForts}
    landMatrix={land}
    mapHeight={mapHeight}
    mapWidth={mapWidth} />
}

export default App
