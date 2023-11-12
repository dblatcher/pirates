import { useState } from 'react'
import { drawScene } from '../canvas-drawing/draw'
import { CanvasScreen } from './CanvasScreen'
import { Controls } from './Controls'
import { KeyboardControls } from './KeyboardControls'
import { ShipDashBoard } from './ShipDashboard'
import { ShipsLog } from './ShipsLog'
import { WorldMap } from './WorldMap'
import { cycle } from '../game-state/cycle'
import { Directive, GameState, Order, ViewPort } from '../game-state/types'
import { buildMatrixFromGameState } from '../lib/path-finding/build-matrix'
import { CellMatrix } from '../lib/path-finding/types'
import { useInterval } from '../hooks/useInterval'
import { WindSock } from './WindSock'
import { Wheel } from './Wheel'
import { SailsWidget } from './SailsWidget'

interface Props {
    initial: GameState
}

const SCREEN_WIDTH = 600
const SCREEN_HEIGHT = 450

const MAP_WIDTH = 2400
const MAP_HEIGHT = 1800

export const BuccaneerGame = ({ initial }: Props) => {
    // to do - is state the best way to hold immutable data?
    const [matrix] = useState<CellMatrix>(buildMatrixFromGameState(MAP_WIDTH, MAP_HEIGHT, initial))
    const [gameState, setGameState] = useState<GameState>(initial)
    const [viewPort, setViewPort] = useState<ViewPort>({ x: 100, y: 10, width: SCREEN_WIDTH, height: SCREEN_HEIGHT })
    const [paused, setPaused] = useState(false)
    const [turbo, setTurbo] = useState(false)
    const [showMap, setShowMap] = useState(false)
    const [directives, setDirectives] = useState<Directive[]>([])
    const [log, setLog] = useState<string[]>([`Yarrgh! Game started at ${new Date().toISOString()}`])
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

    useInterval(refresh, paused ? null : turbo ? 1 : 10)
    const [player] = gameState.ships
    return (
        <div style={{ display: 'flex' }}>
            <main>
                <CanvasScreen
                    containerStyle={{
                        border: '1px solid black',
                        display: 'inline-block',
                        backgroundColor: 'skyblue',
                    }}
                    draw={drawScene(gameState, viewPort)}
                    width={viewPort.width}
                    height={viewPort.height} />

                <aside style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Controls {...{ game: gameState, addDirective }} paused={paused} />
                    {player && (<>
                        <Wheel
                            playerWheel={playerWheel}
                            setPlayerWheel={setPlayerWheel} />
                        <SailsWidget
                            setSailLevelTarget={(value) => {
                                addDirective({ order: Order.SAILS_TO, quantity: value })
                            }}
                            ship={player}
                        />
                        <ShipDashBoard ship={player} />
                    </>
                    )}
                </aside>
            </main>

            <aside>
                <div>
                    <button onClick={() => setPaused(!paused)}>{paused ? 'paused' : 'running'}</button>
                    <button onClick={() => setTurbo(!turbo)}>{turbo ? 'turbo' : 'normal'}</button>
                    <button onClick={() => setShowMap(!showMap)}>{showMap ? 'map' : 'map'}</button>
                    <span>[{player.x.toFixed(0)}, {player.y.toFixed(0)}]</span>
                </div>
                <WindSock wind={gameState.wind} />
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

