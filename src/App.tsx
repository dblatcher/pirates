import { useState } from 'react'
import './App.css'
import { testDraw } from './canvas-drawing/test'
import { CanvasScreen } from './components/CanvasScreen'
import { Directive, GameState } from './game-state/types'
import { Controls } from './components/Controls'
import { useInterval } from './useInterval'
import { cycle } from './game-state/cycle'


function App() {
  const [game, setGame] = useState<GameState>({ x: 10, y: 30 })
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
      <CanvasScreen draw={testDraw(game)} />
      <Controls {...{ game, addDirective }} />

      <pre>{JSON.stringify(game, undefined, 2)}</pre>
    </>
  )
}

export default App
