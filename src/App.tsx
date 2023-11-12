import './App.css'
import { BuccaneerGame } from './components/BucaneerGame'
import { initalState } from './game-state/intial'

function App() { 
  return <BuccaneerGame initial={initalState} />
}

export default App
