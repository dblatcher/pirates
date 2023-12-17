import { useCallback, useRef, useState } from 'react'
import { SoundDeck } from 'sound-deck'
import { Directive, GameState, Order, ViewPort, cycle } from '../game-state'
import { SoundEffectRequest } from '../game-state/model/sound'
import { getTownShipIsInvading } from '../game-state/towns'
import { useSchedule } from '../hooks/useSchedule'
import { CellMatrix } from '../lib/path-finding/types'
import { playSoundEffectsInView } from '../lib/play-sound-effects'
import { average } from '../lib/util'
import { GameControls } from './GameControls'
import { GameScreen } from './GameScreen'
import { ShipsLog } from './ShipsLog'
import { WindSock } from './WindSock'
import { WorldMap } from './WorldMap'

interface Props {
    initial: GameState;
    mapHeight: number;
    mapWidth: number;
    obstacleMatrix: CellMatrix;
    landMatrix: CellMatrix;
    soundDeck: SoundDeck;
}

const magnify = 2 / 3
const SCREEN_WIDTH = 600
const SCREEN_HEIGHT = 450
let lastCycleStartedAt = Date.now()


const makeRefresh = (
    gameStateRef: React.MutableRefObject<GameState>,
    viewPortRef: React.MutableRefObject<ViewPort>,
    obstacleMatrix: CellMatrix,
    getAndClearDirectives: { (): Directive[] },
    updateTimeTracking: { (refreshStart: number): void },
    pushLog: { (message: string): void },
    soundDeck: SoundDeck,
) => () => {
    const refreshStart = Date.now()
    const soundEffectRequests: SoundEffectRequest[] = []

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
        obstacleMatrix,
        pushLog,
        soundEffectRequests,
        viewPortRef.current,
    )
    Object.assign(gameStateRef.current, updatedGame)

    playSoundEffectsInView(soundEffectRequests, soundDeck, viewPortRef.current)
    updateTimeTracking(refreshStart)
}

export const BuccaneerGame = ({ initial, mapHeight, mapWidth, obstacleMatrix, landMatrix, soundDeck }: Props) => {
    const gameStateRef = useRef<GameState>(initial)
    const wheelRef = useRef<number | undefined>(undefined)
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
    const [recentRefeshTimes, setRecentRefreshTimes] = useState<number[]>([])

    const pushLog = (newEntry: string) => setLog([...log, newEntry])

    const addDirective = (directive: Directive) => {
        directivesRef.current.push(directive)
    }

    const updateTimeTracking = useCallback((refreshStart: number) => {
        const timeTaken = Date.now() - lastCycleStartedAt
        setRecentRefreshTimes([timeTaken, ...recentRefeshTimes].slice(0, 10))
        lastCycleStartedAt = refreshStart
    }, [setRecentRefreshTimes, recentRefeshTimes])


    const getAndClearDirectives = useCallback(
        (): Directive[] => {
            const directives: Directive[] = [...directivesRef.current]
            if (typeof wheelRef.current === 'number') {
                directives.push({ order: Order.WHEEL_TO, quantity: wheelRef.current })
            }
            wheelRef.current = undefined
            directivesRef.current = []
            return directives
        },
        []
    )

    const refresh = useCallback(
        makeRefresh(gameStateRef, viewPortRef, obstacleMatrix, getAndClearDirectives, updateTimeTracking, pushLog, soundDeck,),
        [getAndClearDirectives, updateTimeTracking]
    )


    useSchedule(refresh, paused ? null : turbo ? 1 : 10)
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
                    playerWheel={player?.wheel ?? 0}
                    wheelRef={wheelRef}
                />
            </main>

            <aside>
                <div>
                    <span>T: {average(recentRefeshTimes).toFixed(0).padStart(3, " ")}</span>
                </div>
                <div style={{ fontFamily: 'monospace' }}>
                    {'|'}{recentRefeshTimes.slice(0, 10).map(_ => _.toFixed(0).padStart(3, " ")).join(',')}
                </div>
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
                    matrix={landMatrix}
                    mapWidth={mapWidth}
                    mapHeight={mapHeight}
                />
            )}
        </div>
    )
}

