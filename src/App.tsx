import './App.css'
import { BuccaneerGame } from './components/BucaneerGame'
import { initalState } from './game-state/intial'
import { buildMatrixFromGameState } from './lib/path-finding/build-matrix'

const { landAndForts, land } = buildMatrixFromGameState(1800, 2400, initalState)

function App() {
  return <BuccaneerGame
    initial={initalState}
    obstacleMatrix={landAndForts}
    landMatrix={land}
    mapHeight={1800}
    mapWidth={2400} />
}

export default App
