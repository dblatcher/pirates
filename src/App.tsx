import { useState } from 'react'
import './App.css'
import { drawScene } from './canvas-drawing/draw'
import { CanvasScreen } from './components/CanvasScreen'
import { Directive, GameState, ViewPort } from './game-state/types'
import { Controls } from './components/Controls'
import { useInterval } from './useInterval'
import { cycle } from './game-state/cycle'
import { initalState } from './game-state/intial'

const SCREEN_WIDTH = 600
const SCREEN_HEIGHT = 450

function App() {
  const [game, setGame] = useState<GameState>(initalState)
  const [viewPort, setViewPort] = useState<ViewPort>({ x: 100, y: 10, width: SCREEN_WIDTH, height: SCREEN_HEIGHT })
  const [paused, setPaused] = useState(false)
  const [directives, setDirectives] = useState<Directive[]>([])
  const [log, setLog] = useState<string[]>(['Yarrgh!'])

  const pushLog = (newEntry: string) => setLog([...log, newEntry])

  const addDirective = (directive: Directive) => {
    setDirectives([...directives, directive])
  }

  const refresh = () => {
    const newGame = cycle(game, directives, pushLog)
    const [player] = newGame.ships
    if (player) {
      setViewPort({
        width: viewPort.width,
        height: viewPort.height,
        x: player.x - viewPort.width / 2,
        y: player.y - viewPort.height / 2,

      })
    }
    setDirectives([])
    setGame(newGame)
  }

  useInterval(refresh, paused ? null : 10)

  return (
    <div style={{ display: 'flex' }}>
      <main>
        <p>{viewPort.x.toFixed(2)}, {viewPort.y.toFixed(2)}</p>
        <CanvasScreen draw={drawScene(game, viewPort)} width={viewPort.width} height={viewPort.height} />
        <Controls {...{ game, addDirective }} paused={paused} />
      </main>

      <aside>
        <button onClick={() => setPaused(!paused)}>{paused ? 'paused' : 'running'}</button>
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
