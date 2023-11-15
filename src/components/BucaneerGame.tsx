import { useState } from 'react'
import { cycle } from '../game-state/cycle'
import { Directive, GameState, Order, ViewPort } from '../game-state/types'
import { useInterval } from '../hooks/useInterval'
import { buildMatrixFromGameState } from '../lib/path-finding/build-matrix'
import { CellMatrix } from '../lib/path-finding/types'
import { GameScreen } from './GameScreen'
import { GunneryWidget } from './GunneryWidget'
import { KeyboardControls } from './KeyboardControls'
import { SailsWidget } from './SailsWidget'
import { ShipDashBoard } from './ShipDashboard'
import { ShipsLog } from './ShipsLog'
import { Wheel } from './Wheel'
import { WindSock } from './WindSock'
import { WorldMap } from './WorldMap'

interface Props {
    initial: GameState;
    mapHeight: number;
    mapWidth: number;
}

const magnify = 1/2
const SCREEN_WIDTH = 600
const SCREEN_HEIGHT = 450

export const BuccaneerGame = ({ initial, mapHeight, mapWidth }: Props) => {
    // to do - is state the best way to hold immutable data?
    const [matrix] = useState<CellMatrix>(buildMatrixFromGameState(mapWidth, mapHeight, initial))
    const [gameState, setGameState] = useState<GameState>(initial)
    const [viewPort, setViewPort] = useState<ViewPort>({
        x: 100,
        y: 10,
        width: SCREEN_WIDTH / magnify,
        height: SCREEN_HEIGHT / magnify,
    })
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
        const player = updatedGame.ships.find(ship => ship.id === gameState.playerId)
        if (player) {
            setViewPort({
                width: SCREEN_WIDTH / magnify,
                height: SCREEN_HEIGHT / magnify,
                x: player.x - viewPort.width / 2,
                y: player.y - viewPort.height / 2,

            })
        }
        setDirectives([])
        setGameState(updatedGame)
    }

    useInterval(refresh, paused ? null : turbo ? 1 : 10)
    const player = gameState.ships.find(ship => ship.id === gameState.playerId)
    return (
        <div style={{ display: 'flex' }}>
            <main>
                <GameScreen viewPort={viewPort} gameState={gameState} magnify={magnify} />

                <aside style={{ display: 'flex', alignItems: 'flex-start' }}>
                    {player && (<>
                        <GunneryWidget
                            ship={player}
                            addDirective={addDirective}
                            paused={paused} />
                        <Wheel
                            playerWheel={playerWheel}
                            setPlayerWheel={setPlayerWheel} />
                        <SailsWidget
                            setSailLevelTarget={(value) => {
                                addDirective({ order: Order.SAILS_TO, quantity: value })
                            }}
                            ship={player} />
                        <ShipDashBoard
                            ship={player} />
                        <KeyboardControls
                            addDirective={addDirective}
                            turnWheel={setPlayerWheel}
                            paused={paused} />
                    </>
                    )}
                </aside>
            </main>

            <aside>
                <div>
                    <button onClick={() => setPaused(!paused)}>{paused ? 'paused' : 'running'}</button>
                    <button onClick={() => setTurbo(!turbo)}>{turbo ? 'turbo' : 'normal'}</button>
                    <button onClick={() => setShowMap(!showMap)}>{showMap ? 'map' : 'map'}</button>
                    <span>[{player?.x.toFixed(0)}, {player?.y.toFixed(0)}]</span>
                </div>
                <WindSock wind={gameState.wind} />
                <ShipsLog entries={log} />
            </aside>

            {showMap && (
                <WorldMap
                    closeModal={() => { setShowMap(false) }}
                    gameState={gameState}
                    matrix={matrix}
                    mapWidth={mapWidth}
                    mapHeight={mapHeight}
                />
            )}
        </div>
    )
}

