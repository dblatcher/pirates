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
import { WindSock } from './components/WindSock'
import { Wheel } from './components/Wheel'

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
  const [playerWheel, setPlayerWheel] = useState(0)

  const pushLog = (newEntry: string) => setLog([...log, newEntry])

  const addDirective = (directive: Directive) => {
    setDirectives([...directives, directive])
  }

  const refresh = () => {
    const updatedGame = cycle(
      gameState,
      [{ order: Order.WHEEL_TO, quantity: playerWheel }, ...directives],
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
        <div>
          <button onClick={() => setPaused(!paused)}>{paused ? 'paused' : 'running'}</button>
          <button onClick={() => setShowMap(!showMap)}>{showMap ? 'map' : 'map'}</button>
          <span>[{player.x.toFixed(0)}, {player.y.toFixed(0)}]</span>
        </div>
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
        <WindSock wind={gameState.wind} />
        {player && (<>
          <ShipDashBoard ship={player} />
          <Wheel playerWheel={playerWheel} setPlayerWheel={setPlayerWheel} actual={player.wheel} />
        </>
        )}
        <ShipsLog entries={log} />
      </aside>

      {showMap && (
        <WorldMap
          closeModal={() => { setShowMap(false) }}
          gameState={gameState}
          matrix={matrix}
          mapHeight={MAP_HEIGHT}
          mapWidth={MAP_WIDTH}
        />
      )}

      <KeyboardControls
        addDirective={addDirective}
        turnWheel={setPlayerWheel}
        paused={paused} />
    </div>
  )
}

export default App
