import { useState } from 'react'
import './App.css'
import { drawScene } from './canvas-drawing/draw'
import { CanvasScreen } from './components/CanvasScreen'
import { Controls } from './components/Controls'
import { KeyboardControls } from './components/KeyboardControls'
import { ShipDashBoard } from './components/ShipDashboard'
import { ShipsLog } from './components/ShipsLog'
import { WorldMap } from './components/WorldMap'
import { cycle } from './game-state/cycle'
import { initalState } from './game-state/intial'
import { Directive, GameState, Order, ViewPort } from './game-state/types'
import { buildMatrixFromGameState } from './lib/path-finding/build-matrix'
import { CellMatrix } from './lib/path-finding/types'
import { useInterval } from './lib/useInterval'

const SCREEN_WIDTH = 600
const SCREEN_HEIGHT = 450

const MAP_WIDTH = 2400
const MAP_HEIGHT = 1800

function App() {
  // to do - is state the best way to hold immutable data?
  const [matrix] = useState<CellMatrix>(buildMatrixFromGameState(MAP_WIDTH, MAP_HEIGHT, initalState))
  const [gameState, setGameState] = useState<GameState>(initalState)
  const [viewPort, setViewPort] = useState<ViewPort>({ x: 100, y: 10, width: SCREEN_WIDTH, height: SCREEN_HEIGHT })
  const [paused, setPaused] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [directives, setDirectives] = useState<Directive[]>([])
  const [log, setLog] = useState<string[]>(['Yarrgh!'])

  const pushLog = (newEntry: string) => setLog([...log, newEntry])

  const addDirective = (directive: Directive) => {
    setDirectives([...directives, directive])
  }

  const refresh = () => {
    const updatedGame = cycle(
      gameState,
      [{ order: Order.RESET_WHEEL }, ...directives],
      matrix,
      pushLog,
    )
    const [player] = updatedGame.ships
    if (player) {
      setViewPort({
        width: viewPort.width,
        height: viewPort.height,
        x: player.x - viewPort.width / 2,
        y: player.y - viewPort.height / 2,

      })
    }
    setDirectives([])
    setGameState(updatedGame)
  }

  useInterval(refresh, paused ? null : 10)
  const [player] = gameState.ships
  return (
    <div style={{ display: 'flex' }}>
      <main>
        <p>{viewPort.x.toFixed(2)}, {viewPort.y.toFixed(2)}</p>
        <CanvasScreen
          containerStyle={{
            border: '1px solid black',
            display: 'inline-block',
            backgroundColor: 'skyblue',
          }}
          draw={drawScene(gameState, viewPort)} 
          width={viewPort.width} 
          height={viewPort.height} />
        <Controls {...{ game: gameState, addDirective }} paused={paused} />
      </main>

      <aside>
        <button onClick={() => setPaused(!paused)}>{paused ? 'paused' : 'running'}</button>
        <button onClick={() => setShowMap(!showMap)}>{showMap ? 'map' : 'map'}</button>
        {player && (
          <ShipDashBoard ship={player} />

        )}
        <ShipsLog entries={log} />
      </aside>
      <KeyboardControls
        addDirective={addDirective}
        paused={paused} />

      {showMap && (
        <WorldMap
          closeModal={() => { setShowMap(false) }}
          gameState={gameState}
          matrix={matrix}
          mapHeight={MAP_HEIGHT}
          mapWidth={MAP_WIDTH}
        />
      )}
    </div>
  )
}

export default App
