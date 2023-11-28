import { Directive, GameState, Ship, TERRAIN_SQUARE_SIZE } from "../game-state";
import { XY, getDistance } from "../lib/geometry";
import { findPath } from "../lib/path-finding/find-path";
import { CellMatrix } from "../lib/path-finding/types";
import { AIState } from "./types";



export abstract class AI {
    shipId: number;
    state: AIState;
    debugToConsole: boolean;

    constructor(initalState: AIState, shipId: number, debugToConsole = false) {
        this.state = { ...initalState }
        this.shipId = shipId
        this.debugToConsole = debugToConsole
    }

    debugLog(...messages: any[]) {
        if (!this.debugToConsole) { return }
        console.log(`[SHIP:${this.shipId}]`, ...messages)
    }

    abstract issueDirectives(ship: Ship, gameState: GameState): Directive[]

    shiftPathIfReachedPoint(ship: Ship) {
        const [currentStep] = this.state.path
        if (!currentStep) { return }
        if (getDistance(ship, currentStep) < TERRAIN_SQUARE_SIZE / 2) {
            this.debugLog('reaching point - shifting from path', currentStep)
            this.state.path.shift()
        }
    }

    updatePath(ship: Ship, _gameState: GameState, matrix: CellMatrix): void {
        const { destination, path } = this.state
        if (path.length === 0) {
            if (!destination) {
                this.debugLog(ship.name, 'End of path, no destination set')
                // run decide own mission to see what next?
                // or take next objective in current mission (not modelled yet)
                return
            }

            const distance = getDistance(ship, destination)
            if (distance < 20) {
                this.debugLog('End of path, reached destination')
                this.state.destination = undefined
                // run decide own mission to see what next?
                // or take next objective in current mission (not modelled yet)
                return
            }
            this.debugLog(`End of path, not reached destination: ${distance} away`)

            path.push(...this.navigateTo(ship, destination, matrix))
            return
        }

        this.debugLog(`${path.length} steps left in path`)
        // check if still on course - recalculate path if not
        // ie if line to next step is blocked,
        // or more than some distance from it?
    }

    abstract decideOwnMission(gameState: GameState): void

    navigateTo(start: XY, destination: XY, matrix: CellMatrix): XY[] {
        return findPath(start, destination, matrix, TERRAIN_SQUARE_SIZE)
    }
}