import { useState, useRef, useCallback } from 'react'
import { Directive, GameState, Order, ViewPort, cycle } from '../game-state'
import { useInterval } from '../hooks/useInterval'
import { buildMatrixFromGameState } from '../lib/path-finding/build-matrix'
import { CellMatrix } from '../lib/path-finding/types'
import { GameControls } from './GameControls'
import { GameScreen } from './GameScreen'
import { ShipsLog } from './ShipsLog'
import { WindSock } from './WindSock'
import { WorldMap } from './WorldMap'
import { getTownShipIsInvading } from '../game-state/towns'

interface Props {
    initial: GameState;
    mapHeight: number;
    mapWidth: number;
}

const magnify = 2 / 3
const SCREEN_WIDTH = 600
const SCREEN_HEIGHT = 450
let lastCycleStartedAt = Date.now()


const makeRefresh = (
    gameStateRef: React.MutableRefObject<GameState>,
    viewPortRef: React.MutableRefObject<ViewPort>,
    matrix: CellMatrix,
    getAndClearDirectives: { (): Directive[] },
    updateTimeTracking: { (refreshStart: number): void },
    pushLog: { (message: string): void },
) => () => {
    const refreshStart = Date.now()

    const player = gameStateRef.current.ships.find(ship => ship.id === gameStateRef.current.playerId)
    if (player) {
        Object.assign(viewPortRef.current, {
            width: SCREEN_WIDTH / magnify,
            height: SCREEN_HEIGHT / magnify,
            x: player.x - viewPortRef.current.width / 2,
            y: player.y - viewPortRef.current.height / 2,
        })
    }
    const updatedGame = cycle(
        gameStateRef.current,
        getAndClearDirectives(),
        matrix,
        pushLog,
    )
    Object.assign(gameStateRef.current, updatedGame)

    updateTimeTracking(refreshStart)
}

export const BuccaneerGame = ({ initial, mapHeight, mapWidth }: Props) => {
    const matrixRef = useRef<CellMatrix>(buildMatrixFromGameState(mapWidth, mapHeight, initial))
    const gameStateRef = useRef<GameState>(initial)
    const viewPortRef = useRef<ViewPort>({
        x: 100,
        y: 10,
        width: SCREEN_WIDTH / magnify,
        height: SCREEN_HEIGHT / magnify,
    })
    const directivesRef = useRef<Directive[]>([])

    const [paused, setPaused] = useState(false)
    const [turbo, setTurbo] = useState(false)
    const [showMap, setShowMap] = useState(false)
    const [log, setLog] = useState<string[]>([`Yarrgh! Game started at ${new Date().toISOString()}`])
    const [playerWheel, setPlayerWheel] = useState(0)
    const [recentRefeshTimes, setRecentRefreshTimes] = useState<number[]>([])

    const pushLog = (newEntry: string) => setLog([...log, newEntry])

    const addDirective = (directive: Directive) => {
        directivesRef.current.push(directive)
    }

    const updateTimeTracking = useCallback((refreshStart: number) => {
        const timeTaken = Date.now() - lastCycleStartedAt
        setRecentRefreshTimes([timeTaken, ...recentRefeshTimes].slice(0, 15))
        lastCycleStartedAt = refreshStart
    }, [setRecentRefreshTimes, recentRefeshTimes])


    const getAndClearDirectives = useCallback(
        (): Directive[] => {
            const directives: Directive[] = [{ order: Order.WHEEL_TO, quantity: playerWheel }, ...directivesRef.current]
            directivesRef.current = []
            return directives
        },
        [playerWheel]
    )

    const refresh = useCallback(
        makeRefresh(gameStateRef, viewPortRef, matrixRef.current, getAndClearDirectives, updateTimeTracking, pushLog,),
        [getAndClearDirectives]
    )


    useInterval(refresh, paused ? null : turbo ? 1 : 10)
    const player = gameStateRef.current.ships.find(ship => ship.id === gameStateRef.current.playerId)
    return (
        <div style={{ display: 'flex' }}>
            <main>
                <GameScreen
                    viewPort={viewPortRef.current}
                    gameState={gameStateRef.current}
                    magnify={magnify} />

                <GameControls
                    player={player}
                    townInvading={player && getTownShipIsInvading(player, gameStateRef.current.towns)}
                    addDirective={addDirective}
                    paused={paused}
                    playerWheel={playerWheel}
                    setPlayerWheel={setPlayerWheel} />
            </main>

            <aside>
                <span>T: {Math.max(...recentRefeshTimes)}</span>
                <div>
                    <button onClick={() => setPaused(!paused)}>{paused ? 'paused' : 'running'}</button>
                    <button onClick={() => setTurbo(!turbo)}>{turbo ? 'turbo' : 'normal'}</button>
                    <button onClick={() => setShowMap(!showMap)}>{showMap ? 'map' : 'map'}</button>
                    <span>[{player?.x.toFixed(0)}, {player?.y.toFixed(0)}]</span>
                </div>
                <WindSock wind={gameStateRef.current.wind} />
                <ShipsLog entries={log} />
            </aside>

            {showMap && (
                <WorldMap
                    closeModal={() => { setShowMap(false) }}
                    gameState={gameStateRef.current}
                    matrix={matrixRef.current}
                    mapWidth={mapWidth}
                    mapHeight={mapHeight}
                />
            )}
        </div>
    )
}

