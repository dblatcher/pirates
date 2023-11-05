import { AI } from ".";
import { Directive, GameState, Order, Ship } from "../game-state/types";
import { getDistance, getHeading } from "../lib/geometry";
import { CellMatrix } from "../lib/path-finding/types";


export class PathFollowAutoPilot extends AI {

    issueDirectives(ship: Ship, gameState: GameState): Directive[] {

        const directives: Directive[] = []
        const [currentStep] = this.state.path

        if (!currentStep) {
            directives.push(
                { order: Order.SAILS_TO, quantity: 0 },
                { order: Order.RESET_WHEEL },
            )
        } else if (getDistance(ship, currentStep) < 10) {
            directives.push(
                { order: Order.RESET_WHEEL },
            )
            this.state.path.shift()
        } else {
            const heading = getHeading(
                {
                    x: currentStep.x - ship.x,
                    y: currentStep.y - ship.y
                }
            )
            directives.push(
                { order: Order.SAILS_TO, quantity: .5 },
                { order: Order.HEADING_TO, quantity: heading },
            )
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