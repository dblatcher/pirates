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
  const [log, setLog] = useState<string[]>(['Yarrgh!'])

  const pushLog = (newEntry: string) => setLog([...log, newEntry])

  const addDirective = (directive: Directive) => {
    setDirectives([...directives, directive])
  }

  const refresh = () => {
    const newGame = cycle(game, directives, pushLog)
    setDirectives([])
    setGame(newGame)
  }

  useInterval(refresh, 50)

  return (
    <div style={{ display: 'flex' }}>
      <main>
        <CanvasScreen draw={drawScene(game)} />
        <Controls {...{ game, addDirective }} />
      </main>

      <aside>
        <ul>
          {log.map((entry, index) =>
            <li key={index}>{entry}</li>
          )}
        </ul>
      </aside>
    </div>
  )
}

export default App
