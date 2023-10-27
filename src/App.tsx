import { useState } from 'react'
import './App.css'
import { drawScene } from './canvas-drawing/draw'
import { CanvasScreen } from './components/CanvasScreen'
import { Directive, GameState } from './game-state/types'
import { Controls } from './components/Controls'
import { useInterval } from './useInterval'
import { cycle } from './game-state/cycle'
import { initalState } from './game-state/intial'


function App() {
  const [game, setGame] = useState<GameState>(initalState)
  const [directives, setDirectives] = useState<Directive[]>([])

  const addDirective = (directive: Directive) => {
    setDirectives([...directives, directive])
  }

  const refresh =
    () => {
      const newGame = cycle(game, directives)
      setDirectives([])
      setGame(newGame)
    }

  useInterval(refresh, 100)

  return (
    <>
      <CanvasScreen draw={drawScene(game)} />
      <Controls {...{ game, addDirective }} />

      <pre>{JSON.stringify(game, undefined, 2)}</pre>
    </>
  )
}

export default App
