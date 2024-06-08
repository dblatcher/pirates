import { useCallback, useEffect, useRef, useState } from 'react'
import { SoundDeck } from 'sound-deck'
import { ControlCenter, ControlsProvider, DirectiveEvent } from '../context/control-context'
import { useManagement } from '../context/management-context'
import { Directive, GameState, Order, TERRAIN_SQUARE_SIZE, ViewPort } from '../game-state'
import { useSchedule } from '../hooks/useSchedule'
import { SCREEN_HEIGHT, SCREEN_WIDTH, magnify, makeNextCycleFunction } from '../lib/cycle-updates'
import { CellMatrix } from '../lib/path-finding/types'
import { cornerOverlay, middleOverlay } from '../lib/style-helpers'
import { average } from '../lib/util'
import { ScenarioOutcome, checkForPlayerDeathOutcome } from '../scenarios'
import { EndOfScenario } from './EndOfScenario'
import { GameControls } from './GameControls'
import { GameScreen } from './GameScreen'
import { IntroMessage } from './IntroMessage'
import { ShipsLog } from './ShipsLog'
import { WindSock } from './WindSock'
import { WorldMap } from './WorldMap'

interface Props {
    initial: GameState;
    landAndFortsMatrix: CellMatrix;
    paddedObstacleMatrix: CellMatrix;
    landMatrix: CellMatrix;
    soundDeck: SoundDeck;
}

export interface LogEntry {
    message: string;
    cycleNumber: number;
}


let lastCycleStartedAt = Date.now()


export const BuccaneerGame = ({ initial, landAndFortsMatrix, paddedObstacleMatrix, landMatrix, soundDeck }: Props) => {
    const { mainMenuOpen, scenario, gameIsPaused, cyclePeriod } = useManagement()
    const gameStateRef = useRef<GameState>(initial)
    const wheelRef = useRef<number | undefined>(undefined)
    const wheelNotLockedByPointerRef = useRef(true)
    const wheelNotLockedByKeyboardRef = useRef(true)
    const sailChangeRef = useRef<'UP' | 'DOWN' | undefined>(undefined)
    const viewPortRef = useRef<ViewPort>({
        x: 100,
        y: 10,
        width: SCREEN_WIDTH / magnify,
        height: SCREEN_HEIGHT / magnify,
    })
    const directivesRef = useRef<Directive[]>([])

    const [introDone, setIntroDone] = useState(scenario?.intro ? false : true);
    const [doneInitialCycle, setDoneInitialCycle] = useState(false)
    const [mapOpen, setMapOpen] = useState(false)
    const [log, setLog] = useState<LogEntry[]>([{
        message: `Yarrgh! Game started at ${new Date().toISOString()}`,
        cycleNumber: 0,
    }])
    const [recentRefeshTimes, setRecentRefreshTimes] = useState<number[]>([])
    const [outcome, setOutcome] = useState<ScenarioOutcome | undefined>()

    const pushLog = (message: string, cycleNumber: number) => setLog([...log, { message, cycleNumber }])

    const addDirective = useCallback((directive: Directive) => {
        directivesRef.current.push(directive)
    }, [directivesRef])

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
            switch (sailChangeRef.current) {
                case 'DOWN':
                    directives.push({ order: Order.SAILS_BY, quantity: -.01 })
                    break;
                case 'UP':
                    directives.push({ order: Order.SAILS_BY, quantity: .01 })
                    break;
            }
            wheelRef.current = undefined
            directivesRef.current = []
            return directives
        },
        []
    )

    const doNextCycle = useCallback<{ (): void }>(
        makeNextCycleFunction(gameStateRef, viewPortRef, landAndFortsMatrix, paddedObstacleMatrix, getAndClearDirectives, updateTimeTracking, pushLog, soundDeck,),
        [getAndClearDirectives, updateTimeTracking, makeNextCycleFunction,]
    )

    const checkScenarioOver = useCallback(
        () => {
            return scenario?.checkForOutcome?.(gameStateRef.current) || checkForPlayerDeathOutcome(gameStateRef.current)
        }, [scenario, gameStateRef]
    )

    useEffect(() => {
        if (!doneInitialCycle) {
            doNextCycle()
            setDoneInitialCycle(true)
        }
    }, [doneInitialCycle])

    useSchedule(() => {
        if (wheelNotLockedByPointerRef.current === true && wheelNotLockedByKeyboardRef.current && player?.wheel) {
            const changeAmount = Math.min(Math.abs(player.wheel), .01) * Math.sign(player.wheel)
            wheelRef.current = player.wheel - changeAmount
        }
        doNextCycle()
        const newOutcome = !outcome && gameStateRef.current.cycleNumber % 100 == 0 && checkScenarioOver()
        if (newOutcome) {
            setOutcome(newOutcome)
        }
    }, !introDone || gameIsPaused || mainMenuOpen ? null : cyclePeriod)


    const player = gameStateRef.current.ships.find(ship => ship.id === gameStateRef.current.playerId)
    const playerCoordinates = player && { x: Math.floor(player.x / TERRAIN_SQUARE_SIZE), y: Math.floor(player.y / TERRAIN_SQUARE_SIZE) }
    const coordinatesString = playerCoordinates ? `[${playerCoordinates.x.toString().padStart(3, " ")} , ${playerCoordinates.y.toString().padStart(3, " ")}]` : ""

    const [center] = useState(new ControlCenter())

    useEffect(() => {
        const addAddirectiveFromEvent = (e: DirectiveEvent) => {
            addDirective(e.data)
        }
        center.onDirective(addAddirectiveFromEvent)
        return () => {
            center.offDirective(addAddirectiveFromEvent)
        }
    }, [center])

    return (<ControlsProvider value={{ center }}>
        <main style={{ display: 'flex', justifyContent: 'center' }}>
            <section className='game-wrapper'>
                <div style={{ position: 'relative' }}>
                    <GameScreen
                        viewPort={viewPortRef.current}
                        gameState={gameStateRef.current}
                        magnify={magnify} />
                    <div style={cornerOverlay('bottom', 'right')}>
                        <WindSock wind={gameStateRef.current.wind} />
                    </div>
                    <div style={cornerOverlay('top', 'right')}>
                        <span>{coordinatesString}</span>
                    </div>
                    <div style={cornerOverlay('bottom', 'left')}>
                        <ShipsLog entries={log} currentCycleNumber={gameStateRef.current.cycleNumber} />
                    </div>
                    {outcome &&
                        <div style={middleOverlay(60)}>
                            {<EndOfScenario outcome={outcome} />}
                        </div>
                    }
                </div>

                <GameControls
                    player={player}
                    paused={gameIsPaused}
                    playerWheel={player?.wheel ?? 0}
                    wheelRef={wheelRef}
                    sailChangeRef={sailChangeRef}
                    wheelNotLockedByPointerRef={wheelNotLockedByPointerRef}
                    wheelNotLockedByKeyboardRef={wheelNotLockedByKeyboardRef}
                    mapOpen={mapOpen}
                    setMapOpen={setMapOpen}
                />
            </section>
        </main>

        {mapOpen && (
            <WorldMap
                closeModal={() => { setMapOpen(false) }}
                gameState={gameStateRef.current}
                matrix={landMatrix}
                mapWidth={initial.mapWidth}
                mapHeight={initial.mapHeight}
            />
        )}

        {scenario?.intro && !introDone && (
            <IntroMessage
                intro={scenario.intro}
                soundDeck={soundDeck}
                closeIntro={() => { setIntroDone(true) }}
            />
        )}

        <span className='performance-monitor'>
            T: {average(recentRefeshTimes).toFixed(0).padStart(3, " ")}
        </span>
    </ControlsProvider>)
}

