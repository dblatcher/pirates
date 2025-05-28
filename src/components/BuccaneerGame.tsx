import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SoundDeck } from 'sound-deck'
import { ControlCenter, ControlsProvider, DirectiveEvent, KeyMap, WheelValueEvent } from '../context/control-context'
import { useManagement } from '../context/management-context'
import { Directive, FiringPattern, GameState, Order, ViewPort } from '../game-state'
import { useSchedule } from '../hooks/useSchedule'
import { useWindowSizeContext } from '../hooks/useWindowSize'
import { makeNextCycleFunction } from '../lib/cycle-updates'
import { makeKeyDownHandler, makeKeyMapHandler } from '../lib/game-keyboard-handling'
import { CellMatrix } from '../lib/path-finding/types'
import { cornerOverlay, middleOverlay } from '../lib/style-helpers'
import { average, clamp } from '../lib/util'
import { ScenarioOutcome, checkForPlayerDeathOutcome } from '../scenarios'
import './BuccaneerGame.css'
import { EndOfScenario } from './EndOfScenario'
import { GameControls } from './GameControls'
import { GameScreen } from './GameScreen'
import { IntroMessage } from './IntroMessage'
import { KeyboardControls } from './KeyboardControls'
import { PlayerStatus } from './PlayerStatus'
import { ShipsLog } from './ShipsLog'
import { TouchControlWrapper } from './TouchControlWrapper'
import { WindSock } from './WindSock'
import { WorldMap } from './WorldMap'

const MAX_VIEWPORT_WIDTH = 750
const MAX_VIEWPORT_HEIGHT = 425

interface Props {
    initial: GameState;
    landAndFortsMatrix: CellMatrix;
    paddedObstacleMatrix: CellMatrix;
    landMatrix: CellMatrix;
    soundDeck: SoundDeck;
    children?: ReactNode
}

export interface LogEntry {
    message: string;
    cycleNumber: number;
}


let lastCycleStartedAt = Date.now()


export const BuccaneerGame = ({ initial, landAndFortsMatrix, paddedObstacleMatrix, landMatrix, soundDeck, children }: Props) => {
    const { windowWidth, windowHeight } = useWindowSizeContext()
    const { mainMenuOpen, scenario, gameIsPaused, cyclePeriod } = useManagement()
    const [magnify, setMagnify] = useState(() => {
        return windowWidth < 600 ? 3 / 6 : 4 / 6
    })
    const gameStateRef = useRef<GameState>(initial)
    const [firingPattern, setFiringPattern] = useState<FiringPattern>(FiringPattern.BROADSIDE)
    const wheelRef = useRef<number | undefined>(undefined)
    const rowBackRef = useRef<boolean>(false)
    const wheelNotLockedByKeyboardRef = useRef(true)
    const [center] = useState(new ControlCenter())
    const sailChangeRef = useRef<'UP' | 'DOWN' | undefined>(undefined)
    const viewPortRef = useRef<ViewPort>({
        x: 100,
        y: 10,
        width: Math.min(windowWidth - 40, MAX_VIEWPORT_WIDTH) / magnify,
        height: Math.min(windowWidth, MAX_VIEWPORT_HEIGHT) / magnify,
    })
    const keyMapRef = useRef<KeyMap>({})
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

    const pushLog = useCallback((message: string, cycleNumber: number) => setLog([...log, { message, cycleNumber }]), [setLog, log])

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
            if (rowBackRef.current) {
                directives.push({ order: Order.ROW_BACK })
            }
            wheelRef.current = undefined
            directivesRef.current = []
            return directives
        },
        []
    )

    const doNextCycle = useMemo<{ (): void }>(
        () => makeNextCycleFunction(gameStateRef.current, viewPortRef.current, landAndFortsMatrix, paddedObstacleMatrix, getAndClearDirectives, updateTimeTracking, pushLog, soundDeck,),
        [getAndClearDirectives, updateTimeTracking, landAndFortsMatrix, paddedObstacleMatrix, soundDeck, pushLog]
    )

    const checkScenarioOver = useCallback(
        () => {
            return scenario?.checkForOutcome?.(gameStateRef.current) || checkForPlayerDeathOutcome(gameStateRef.current)
        }, [scenario, gameStateRef]
    )

    const keyMapHandler = useMemo(() =>
        makeKeyMapHandler({ wheelRef, wheelNotLockedByKeyboardRef, sailChangeRef, rowBackRef }),
        [wheelRef, wheelNotLockedByKeyboardRef, sailChangeRef, rowBackRef]
    )

    const keyDownFunction = useMemo(() => makeKeyDownHandler(gameIsPaused, center, setFiringPattern, firingPattern, setMapOpen, mapOpen),
        [gameIsPaused, center, setFiringPattern, firingPattern, setMapOpen, mapOpen]
    )

    const adjustScale = (scale = magnify) => {
        const adjusted = clamp(scale, 8 / 6, 2 / 6)
        setMagnify(adjusted);
        viewPortRef.current.width = Math.min(windowWidth, MAX_VIEWPORT_WIDTH) / adjusted
        viewPortRef.current.height = Math.min(windowHeight - 40, MAX_VIEWPORT_HEIGHT) / adjusted
    }

    useEffect(adjustScale, [windowWidth, windowHeight, magnify])

    useEffect(() => {
        if (!doneInitialCycle) {
            doNextCycle()
            setDoneInitialCycle(true)
        }
    }, [doneInitialCycle, setDoneInitialCycle, doNextCycle])

    useSchedule(() => {
        // let player wheel drift back to 0 if not locked or being turned by the player
        if (center.wheelFreeFromPointer.current === true && wheelNotLockedByKeyboardRef.current && player?.wheel) {
            const changeAmount = Math.min(Math.abs(player.wheel), .01) * Math.sign(player.wheel)
            wheelRef.current = player.wheel - changeAmount
        }
        keyMapHandler(keyMapRef.current)
        doNextCycle()
        const newOutcome = !outcome && gameStateRef.current.cycleNumber % 100 == 0 && checkScenarioOver()
        if (newOutcome) {
            setOutcome(newOutcome)
        }
    }, !introDone || gameIsPaused || mainMenuOpen ? null : cyclePeriod)


    const player = gameStateRef.current.ships.find(ship => ship.id === gameStateRef.current.playerId)

    useEffect(() => {
        const addAddirectiveFromEvent = (e: DirectiveEvent) => {
            addDirective(e.data)
        }
        const changeWheelValueFromEvent = (e: WheelValueEvent) => {
            wheelRef.current = e.data
        }
        center.onDirective(addAddirectiveFromEvent)
        center.onWheelValue(changeWheelValueFromEvent)
        return () => {
            center.offDirective(addAddirectiveFromEvent)
            center.offWheelValue(changeWheelValueFromEvent)
        }
    }, [center, addDirective])

    return (<ControlsProvider value={{ center, keyMapRef }}>
        <main style={{ display: 'flex', justifyContent: 'center' }}>
            <section className='game-wrapper' >
                <TouchControlWrapper
                    gameStateRef={gameStateRef}
                    viewPortRef={viewPortRef}
                >
                    <GameScreen
                        viewPort={viewPortRef.current}
                        gameState={gameStateRef.current}
                        magnify={magnify} />
                    <div style={cornerOverlay('bottom', 'right')}>
                        <WindSock wind={gameStateRef.current.wind} />
                        <button onClick={() => { adjustScale(magnify + (1 / 6)) }}>+</button>
                        <button onClick={() => { adjustScale(magnify - (1 / 6)) }}>-</button>
                    </div>
                    <div style={cornerOverlay('top', 'left')} className='blur-frame'>
                        {player && (
                            <PlayerStatus ship={{ ...player }} />
                        )}
                    </div>
                    <div style={cornerOverlay('top', 'right')}>
                        {children}
                    </div>
                    <div style={cornerOverlay('bottom', 'left')}>
                        <ShipsLog entries={log} currentCycleNumber={gameStateRef.current.cycleNumber} />
                    </div>
                    {outcome &&
                        <div style={middleOverlay(60)}>
                            {<EndOfScenario outcome={outcome} />}
                        </div>
                    }
                </TouchControlWrapper>

                <GameControls
                    player={player}
                    objectives={gameStateRef.current.objectives}
                    paused={gameIsPaused}
                    mapOpen={mapOpen}
                    setMapOpen={setMapOpen}
                    firingPattern={firingPattern}
                    setFiringPattern={setFiringPattern}
                />
                <KeyboardControls
                    keyDownFunction={keyDownFunction}
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

        <span className='performance-monitor blur-frame'>
            T: {average(recentRefeshTimes).toFixed(0).padStart(3, " ")}
        </span>
    </ControlsProvider>)
}

