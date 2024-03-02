import { useCallback, useEffect, useRef, useState } from 'react'
import { SoundDeck } from 'sound-deck'
import { useManagement } from '../context/management-context'
import { aiFactory } from '../factory'
import { Directive, GameState, Order, TERRAIN_SQUARE_SIZE, ViewPort, cycle } from '../game-state'
import { SoundEffectRequest } from '../game-state/model/sound'
import { useSchedule } from '../hooks/useSchedule'
import { ScenarioOutcome, checkForPlayerDeathOutcome } from '../scenarios'
import { CellMatrix } from '../lib/path-finding/types'
import { playSoundEffectsInView } from '../lib/sounds'
import { average, clamp } from '../lib/util'
import { EndOfScenario } from './EndOfScenario'
import { GameControls } from './GameControls'
import { GameScreen } from './GameScreen'
import { IntroMessage } from './IntroMessage'
import { ShipsLog } from './ShipsLog'
import { WindSock } from './WindSock'
import { WorldMap } from './WorldMap'
import { cornerOverlay, middleOverlay } from '../lib/style-helpers'

interface Props {
    initial: GameState;
    obstacleMatrix: CellMatrix;
    landMatrix: CellMatrix;
    soundDeck: SoundDeck;
}

export interface LogEntry {
    message: string;
    cycleNumber: number;
}

const magnify = 2 / 3
const SCREEN_WIDTH = 700
const SCREEN_HEIGHT = 425
let lastCycleStartedAt = Date.now()


const makeNextCycleFunction = (
    gameStateRef: React.MutableRefObject<GameState>,
    viewPortRef: React.MutableRefObject<ViewPort>,
    obstacleMatrix: CellMatrix,
    getAndClearDirectives: { (): Directive[] },
    updateTimeTracking: { (refreshStart: number): void },
    pushLog: { (message: string, timestamp: number): void },
    soundDeck: SoundDeck,
) => () => {
    const refreshStart = Date.now()
    const soundEffectRequests: SoundEffectRequest[] = []

    const player = gameStateRef.current.ships.find(ship => ship.id === gameStateRef.current.playerId)
    if (player) {
        const viewPortWidth = SCREEN_WIDTH / magnify
        const viewPortHeight = SCREEN_HEIGHT / magnify
        Object.assign(viewPortRef.current, {
            width: viewPortWidth,
            height: viewPortHeight,
            x: clamp(player.x - viewPortWidth * .5, gameStateRef.current.mapWidth - (viewPortWidth * 1), 0),
            y: clamp(player.y - viewPortRef.current.height * .5, gameStateRef.current.mapHeight - (viewPortHeight), 0),
        })
    }
    const updatedGame = cycle(
        gameStateRef.current,
        getAndClearDirectives(),
        obstacleMatrix,
        pushLog,
        soundEffectRequests,
        viewPortRef.current,
        aiFactory,
    )
    Object.assign(gameStateRef.current, updatedGame)

    playSoundEffectsInView(soundEffectRequests, soundDeck, viewPortRef.current)
    updateTimeTracking(refreshStart)
}

export const BuccaneerGame = ({ initial, obstacleMatrix, landMatrix, soundDeck }: Props) => {
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

    const doNextCycle = useCallback(
        makeNextCycleFunction(gameStateRef, viewPortRef, obstacleMatrix, getAndClearDirectives, updateTimeTracking, pushLog, soundDeck,),
        [getAndClearDirectives, updateTimeTracking]
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

    return (<>
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
                    addDirective={addDirective}
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
    </>)
}

