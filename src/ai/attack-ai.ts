import { AI } from ".";
import { Directive, GameState, Order, Ship, Side } from "../game-state/types";
import { Rect, _90_DEG_LEFT, _DEG, findClosestAndDistance, getDistance, getHeading, getVectorFrom, isPointInsideRect, normaliseHeading } from "../lib/geometry";
import { CellMatrix } from "../lib/path-finding/types";
import { splitArray } from "../lib/util";


export class AttackAutoPilot extends AI {

    issueDirectives(ship: Ship, gameState: GameState): Directive[] {

        const directives: Directive[] = []

        const sightRange = 300
        const sightRect: Rect = {
            top: ship.y - sightRange,
            left: ship.x - sightRange,
            bottom: ship.y + sightRange,
            right: ship.x + sightRange,

        }

        const nearbyShips = gameState.ships.filter(otherShip => ship !== otherShip && isPointInsideRect(otherShip, sightRect))
        const [enemies, _allies] = splitArray(nearbyShips, (otherShip) => otherShip.faction !== ship.faction)

        const { item: closestEnemy, distance } = findClosestAndDistance(enemies, ship)
        if (closestEnemy) {
            const vector = getVectorFrom(ship, closestEnemy)
            const heading = getHeading(vector)

            const targetDirection = heading - _90_DEG_LEFT

            directives.push({
                order: Order.HEADING_TO, quantity: targetDirection
            })

            const differenceInAngle = Math.abs(normaliseHeading(targetDirection) - normaliseHeading(ship.h))
            console.log(closestEnemy.name, distance, differenceInAngle)

            if (distance < 100 && differenceInAngle < _DEG * 30) {
                console.log('FIRE')
                directives.push({ order: Order.FIRE, side: Side.LEFT })
            }

        }

        return directives
    }

    updatePath(ship: Ship, gameState: GameState, matrix: CellMatrix): void {
        const { destination, path } = this.state
        if (path.length === 0) {

            if (!destination) {
                console.log('End of path, no destination set')
                // run decide own mission to see what next?
                // or take next objective in current mission (not modelled yet)
                return
            }

            const distance = getDistance(ship, destination)
            if (distance < 20) {
                console.log('End of path, reached destination')
                this.state.destination = undefined
                // run decide own mission to see what next?
                // or take next objective in current mission (not modelled yet)
                return
            }
            console.log(`End of path, not reached destination: ${distance} away`)

            path.push(...this.navigateTo(ship, destination, matrix))
            return
        }

        console.log(`${path.length} steps left in path`)
        // check if still on course - recalculate path if not
        // ie if line to next step is blocked,
        // or more than some distance from it?
    }

    decideOwnMission(gameState: GameState): void {
        throw new Error("Method not implemented.");
    }

}