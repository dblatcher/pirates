import { Directive, MIN_CYCLES_BETWEEN_PATH_FINDING, Ship, TERRAIN_SQUARE_SIZE } from "../game-state";
import { describeShipWithId } from "../game-state/ship";
import { XY, findClosestAndDistance, getDistance } from "typed-geometry";
import { findPath } from "../lib/path-finding/find-path";
import { AIState, DescisonContext } from "./types";



export abstract class AI {
    state: AIState;
    debugToConsole: boolean;

    constructor(initalState: AIState, debugToConsole = false) {
        this.state = { ...initalState }
        this.debugToConsole = debugToConsole
    }

    debugLog(ship: Ship) {
        return (...messages: unknown[]) => {
            if (!this.debugToConsole) { return }
            console.log(`${describeShipWithId(ship)}[${ship.x},${ship.y} ]:`, ...messages)
        }
    }

    abstract issueDirectives(context: DescisonContext): Directive[]

    shiftPathIfReachedPoint(ship: Ship) {
        const [currentStep] = this.state.path
        if (!currentStep) { return }
        if (getDistance(ship, currentStep) < TERRAIN_SQUARE_SIZE / 2) {
            this.state.path.shift()
            if (this.state.path.length === 0) {
                this.debugLog(ship)('shifted last step', currentStep)
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

    setPathToDestination(context: DescisonContext): void {
        const { ship, gameState } = context

        const { destination, path, lastCycleWithPathfinding = -MIN_CYCLES_BETWEEN_PATH_FINDING } = this.state

        if (!destination || path.length > 0) {
            return
        }

        if (gameState.cycleNumber - lastCycleWithPathfinding < MIN_CYCLES_BETWEEN_PATH_FINDING) {
            if (gameState.cycleNumber - lastCycleWithPathfinding === 1) {
                this.debugLog(ship)('cannot pathfind again so soon!',)
            }
            return
        }

        if (this.haveReachedDestination(ship)) {
            this.debugLog(ship)(`Already close to destination.`, destination)
            return this.setDestination(undefined)
        }
        this.navigateTo(ship, destination, context)
    }

    getCurrentTarget(ship: Ship, relevantShipsInRange: Ship[]): { ship?: Ship, distance: number } {
        const { targetShipId } = this.state.mission
        if (targetShipId) {
            const targetShip = relevantShipsInRange.find(ship => ship.id === targetShipId)
            if (targetShip) {
                return { ship: targetShip, distance: getDistance(ship, targetShip) }
            }
        }
        return { distance: Infinity }
    }

    getCurrentTargetOrChooseClosest(ship: Ship, relevantShipsInRange: Ship[]): { ship?: Ship, distance: number } {
        const { targetShipId } = this.state.mission
        if (targetShipId) {
            const targetShip = relevantShipsInRange.find(otherShip => otherShip.id === targetShipId)
            if (targetShip) {
                return { ship: targetShip, distance: getDistance(ship, targetShip) }
            }
            this.debugLog(ship)(`current target ship#${targetShipId} no longer in range`)
            this.state.mission.targetShipId = undefined
        }

        const { item: newTargetShip, distance } = findClosestAndDistance(relevantShipsInRange, ship)
        if (newTargetShip) {
            this.debugLog(ship)(`closest target is ${describeShipWithId(newTargetShip)} ${distance.toFixed(0)} away. Setting as target`)
            this.state.mission.targetShipId = newTargetShip.id
            return { ship: newTargetShip, distance }
        }

        return { distance: Infinity }
    }

    private useWaypoint(newWaypointIndex: number, context: DescisonContext) {
        const { waypoints } = this.state.mission
        if (!waypoints || waypoints.length === 0) {
            // this.debugLog(context.ship)(`cannot set destination - mission has no waypoints`)
            return
        }

        const waypoint = waypoints[newWaypointIndex]
        if (!waypoint) {
            this.debugLog(context.ship)(`There is no waypoint #${newWaypointIndex} - length is ${waypoints.length}`)
        }
        this.setDestination(waypoint)
        this.state.mission.waypointIndex = newWaypointIndex
        this.debugLog(context.ship)(`Waypoint #${newWaypointIndex} is destination`, waypoint)
    }

    setDestinationToNextWaypoint(context: DescisonContext) {
        const { waypointIndex = 0, waypoints = [] } = this.state.mission
        this.useWaypoint(waypointIndex + 1 >= waypoints.length ? 0 : waypointIndex + 1, context)
    }

    setDestinationToCurrentWaypoint(context: DescisonContext) {
        const { waypointIndex = 0, } = this.state.mission
        this.useWaypoint(waypointIndex, context)
    }

    navigateTo(start: XY, destination: XY, context: DescisonContext) {
        const { ship, gameState, paddedMatrix, matrix } = context
        this.state.lastCycleWithPathfinding = gameState.cycleNumber

        const routeAvoidingCoasts = findPath(start, destination, paddedMatrix, TERRAIN_SQUARE_SIZE, { diagonalAllowed: true })
        const cannotAvoidCoasts = routeAvoidingCoasts.length === 0
        const routeCloseToCoast = cannotAvoidCoasts ? findPath(start, destination, matrix, TERRAIN_SQUARE_SIZE, { diagonalAllowed: false }) : [];
        const routeToUse = cannotAvoidCoasts ? routeCloseToCoast : routeAvoidingCoasts

        // TO DO - big ships dont try using routeCloseToCoast?

        if (routeToUse.length === 0) {
            this.debugLog(ship)('CANNOT REACH', destination, `[${Math.floor(destination.x / TERRAIN_SQUARE_SIZE)}, ${Math.floor(destination.y / TERRAIN_SQUARE_SIZE)}]`)
            this.setDestination(undefined)
            return
        }

        this.debugLog(ship)(`new route to destination: ${routeToUse.length} steps`, destination, { cannotAvoidCoasts })
        this.state.path.push(...routeToUse)
    }
}