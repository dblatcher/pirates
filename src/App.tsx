import './App.css'
import { BuccaneerGame } from './components/BucaneerGame'
import { initalState } from './game-state/intial'

function App() {
  return <BuccaneerGame
    initial={initalState}
    mapHeight={1800}
    mapWidth={2400} />
}

export default App
