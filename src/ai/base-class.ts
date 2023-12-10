import { Directive, GameState, Ship, TERRAIN_SQUARE_SIZE } from "../game-state";
import { describeShipWithId } from "../game-state/ship";
import { XY, findClosestAndDistance, getDistance } from "../lib/geometry";
import { findPath } from "../lib/path-finding/find-path";
import { CellMatrix } from "../lib/path-finding/types";
import { AIState, DescisonContext } from "./types";



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

    abstract issueDirectives(context: DescisonContext): Directive[]

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

    setDestination(point: XY | undefined): void {
        this.state.destination = point
        this.state.path = []
    }

    haveReachedDestination(ship: Ship): boolean | undefined {
        const { destination } = this.state
        return destination
            ? getDistance(ship, destination) < TERRAIN_SQUARE_SIZE / 2
            : undefined
    }

    setPathToDestination(ship: Ship, _gameState: GameState, matrix: CellMatrix): void {
        const { destination, path } = this.state

        if (!destination || path.length > 0) {
            return
        }

        if (this.haveReachedDestination(ship)) {
            this.debugLog(`Already close to destination.`, destination)
            return this.setDestination(undefined)
        }

        const route = this.navigateTo(ship, destination, matrix)
        if (route.length === 0) {
            this.debugLog('CANNOT REACH', destination)
            return this.setDestination(undefined)
        }
        this.debugLog(`new route to destination: ${route.length} steps`, destination)
        path.push(...route)
    }

    getCurrentTarget(thisShip: Ship, relevantShipsInRange: Ship[]): { ship?: Ship, distance: number } {
        const { targetShipId } = this.state.mission
        if (targetShipId) {
            const ship = relevantShipsInRange.find(ship => ship.id === targetShipId)
            if (ship) {
                return { ship, distance: getDistance(thisShip, ship) }
            }
        }
        return { distance: Infinity }
    }

    getCurrentTargetOrChooseClosest(thisShip: Ship, relevantShipsInRange: Ship[]): { ship?: Ship, distance: number } {
        const { targetShipId } = this.state.mission
        if (targetShipId) {
            const ship = relevantShipsInRange.find(ship => ship.id === targetShipId)
            if (ship) {
                return { ship, distance: getDistance(thisShip, ship) }
            }
            this.debugLog(`current target ship#${targetShipId} no longer in range`)
            this.state.mission.targetShipId = undefined
        }

        const { item: ship, distance } = findClosestAndDistance(relevantShipsInRange, thisShip)
        if (ship) {
            this.debugLog(`closest target is ${describeShipWithId(ship)} ${distance.toFixed(0)} away. Setting as target`)
            this.state.mission.targetShipId = ship.id
            return { ship, distance }
        }

        return { distance: Infinity }
    }

    private useWaypoint(newWaypointIndex: number) {
        const { waypoints } = this.state.mission
        if (!waypoints || waypoints.length === 0) {
            this.debugLog(`cannot set destination - mission has no waypoints`)
            return
        }

        const waypoint = waypoints[newWaypointIndex]
        if (!waypoint) {
            this.debugLog(`There is no waypoint #${newWaypointIndex} - length is ${waypoints.length}`)
        }
        this.setDestination(waypoint)
        this.state.mission.waypointIndex = newWaypointIndex
        this.debugLog(`Waypoint #${newWaypointIndex} is destination`, waypoint)
    }

    setDestinationToNextWaypoint() {
        const { waypointIndex = 0, waypoints = [] } = this.state.mission
        this.useWaypoint(waypointIndex + 1 >= waypoints.length ? 0 : waypointIndex + 1)
    }

    setDestinationToCurrentWaypoint() {
        const { waypointIndex = 0, } = this.state.mission
        this.useWaypoint(waypointIndex)
    }

    navigateTo(start: XY, destination: XY, matrix: CellMatrix): XY[] {
        return findPath(start, destination, matrix, TERRAIN_SQUARE_SIZE, { diagonalAllowed: false })
    }
}