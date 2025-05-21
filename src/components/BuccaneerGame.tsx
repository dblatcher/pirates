import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SoundDeck } from 'sound-deck'
import { ControlCenter, ControlsProvider, DirectiveEvent, KeyMap, WheelValueEvent } from '../context/control-context'
import { useManagement } from '../context/management-context'
import { Directive, FiringPattern, GameState, Order, Side, TERRAIN_SQUARE_SIZE, ViewPort } from '../game-state'
import { useSchedule } from '../hooks/useSchedule'
import { makeNextCycleFunction } from '../lib/cycle-updates'
import { CellMatrix } from '../lib/path-finding/types'
import { cornerOverlay, middleOverlay } from '../lib/style-helpers'
import { average, clamp } from '../lib/util'
import { ScenarioOutcome, checkForPlayerDeathOutcome } from '../scenarios'
import { EndOfScenario } from './EndOfScenario'
import { GameControls } from './GameControls'
import { GameScreen } from './GameScreen'
import { IntroMessage } from './IntroMessage'
import { ShipsLog } from './ShipsLog'
import { WindSock } from './WindSock'
import { WorldMap } from './WorldMap'
import { makeKeyDownHandler, makeKeyMapHandler } from '../lib/game-keyboard-handling'
import { KeyboardControls } from './KeyboardControls'
import { FullGestureState, useGesture } from '@use-gesture/react'

const SCREEN_WIDTH = 750
const SCREEN_HEIGHT = 425

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
    const { mainMenuOpen, scenario, gameIsPaused, cyclePeriod, controlMode } = useManagement()
    const [magnify, setMagnify] = useState(4 / 6)
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
        width: SCREEN_WIDTH / magnify,
        height: SCREEN_HEIGHT / magnify,
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
    const playerCoordinates = player && { x: Math.floor(player.x / TERRAIN_SQUARE_SIZE), y: Math.floor(player.y / TERRAIN_SQUARE_SIZE) }
    const coordinatesString = playerCoordinates ? `[${playerCoordinates.x.toString().padStart(3, " ")} , ${playerCoordinates.y.toString().padStart(3, " ")}]` : ""

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

    const adjustScale = (scale: number) => {
        const adjusted = clamp(scale, 8 / 6, 2 / 6)
        setMagnify(adjusted);
        viewPortRef.current.width = SCREEN_WIDTH / adjusted
        viewPortRef.current.height = SCREEN_HEIGHT / adjusted
    }

    const handleDrag = (state: Omit<FullGestureState<"drag">, "event"> & {
        event: PointerEvent | MouseEvent | TouchEvent | KeyboardEvent;
    }) => {

        const xMovement = state.movement[0]
        const yDelta = state.delta[1]

        if (Math.abs(yDelta) > 1.5) {
            center.sendDirective({
                order: Order.SAILS_BY,
                quantity: (-yDelta - 1.5 * Math.sign(yDelta)) / 100
            })
        }

        center.wheelFreeFromPointer.current = false
        if (state.event.type === 'pointerup') {
            center.wheelFreeFromPointer.current = true
        }

        const adjustedXMovement = -Math.sign(xMovement) * clamp(Math.abs(xMovement) / 100, .5);
        center.sendWheelValue(adjustedXMovement)
    }

    const bindGestures = useGesture({
        onDrag: handleDrag,
        onDoubleClick: ({ event }) => {
            console.log(event.clientX, event.clientY, event.target)
            // TO DO - locate the tap to determine which side to fire from
            center.sendDirective({
                side: Side.LEFT,
                order: Order.FIRE,
                pattern: FiringPattern.ALTERNATE
            })
        }
    }, {
        enabled: controlMode === 'touchscreen'
    })

    return (<ControlsProvider value={{ center, keyMapRef }}>
        <main style={{ display: 'flex', justifyContent: 'center' }}>
            <section className='game-wrapper' >
                <div style={{
                    position: 'relative',
                    touchAction: 'none',
                }} {...bindGestures()} >
                    <GameScreen
                        viewPort={viewPortRef.current}
                        gameState={gameStateRef.current}
                        magnify={magnify} />
                    <div style={cornerOverlay('bottom', 'right')}>
                        <WindSock wind={gameStateRef.current.wind} />
                        <button onClick={() => { adjustScale(magnify + (1 / 6)) }}>+</button>
                        <button onClick={() => { adjustScale(magnify - (1 / 6)) }}>-</button>
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

        <span className='performance-monitor'>
            T: {average(recentRefeshTimes).toFixed(0).padStart(3, " ")}
        </span>
    </ControlsProvider>)
}

