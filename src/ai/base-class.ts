import { Directive, GameState, Ship, TERRAIN_SQUARE_SIZE } from "../game-state";
import { describeShipWithId } from "../game-state/ship";
import { XY, findClosestAndDistance, getDistance } from "../lib/geometry";
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
            this.state.path.shift()
            if (this.state.path.length === 0) {
                this.debugLog('shifted last step', currentStep)
            }
        }
    }

    updatePath(ship: Ship, _gameState: GameState, matrix: CellMatrix): void {
        const { destination, path } = this.state
        if (destination && path.length === 0) {
            const distance = getDistance(ship, destination)
            if (distance < TERRAIN_SQUARE_SIZE / 2) {
                this.debugLog('End of path, reached destination')
                this.state.destination = undefined
                // run decide own mission to see what next?
                // or take next objective in current mission (not modelled yet)
                return
            }
            this.debugLog(`End of path, not reached destination: ${distance.toFixed(0)} away`, path)

            const route = this.navigateTo(ship, destination, matrix)
            if (route.length === 0) {
                this.debugLog('CANNOT REACH', destination)
                // TO DO - choose another destination
                return
            }
            this.debugLog(`new route to destination: ${route.length} steps`, destination)
            path.push(...route)
            return
        }

        // this.debugLog(`${path.length} steps left in path`)
        // check if still on course - recalculate path if not
        // ie if line to next step is blocked,
        // or more than some distance from it?
    }

    getCurrentTargetOrChooseClosest(thisShip: Ship, enemiesInSight: Ship[]): { ship?: Ship, distance: number } {
        const { targetShipId } = this.state.mission
        if (targetShipId) {
            const ship = enemiesInSight.find(ship => ship.id === targetShipId)
            if (ship) {
                return { ship, distance: getDistance(thisShip, ship) }
            }
            this.debugLog(`current target ship#${targetShipId} no longer in sight`)
            this.state.mission.targetShipId = undefined
        }

        const { item: ship, distance } = findClosestAndDistance(enemiesInSight, thisShip)
        if (ship) {
            this.debugLog(`closest target is ${describeShipWithId(ship)} ${distance.toFixed(0)} away. Setting as target`)
            this.state.mission.targetShipId = ship.id
            return { ship, distance }
        }

        return { distance: Infinity }
    }

    abstract decideOwnMission(gameState: GameState): void

    navigateTo(start: XY, destination: XY, matrix: CellMatrix): XY[] {
        return findPath(start, destination, matrix, TERRAIN_SQUARE_SIZE)
    }
}