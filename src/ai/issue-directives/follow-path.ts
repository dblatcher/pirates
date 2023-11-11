import { Ship } from "../../game-state/ship"
import { Directive, Order } from "../../game-state/types"
import { _DEG, findRotationBetweenHeadings, getDistance, getHeading } from "../../lib/geometry"
import { AI } from "../base-class"

export const followCurrentPath = (ai: AI, ship: Ship): Directive[] => {

    const directives: Directive[] = []
    const [currentStep] = ai.state.path

    if (!currentStep) {
        // PATH IS FINISHED, ALL STOP
        directives.push(
            { order: Order.SAILS_TO, quantity: 0 },
            { order: Order.RESET_WHEEL },
        )
    } else if (getDistance(ship, currentStep) < 10) {
        // GOT TO WAYPOINT
        directives.push(
            { order: Order.RESET_WHEEL },
        )
        // TO DO - would be neater to avoid this side effect
        // can shifting from path be part of the core/default AI cycle?
        ai.state.path.shift()
    } else {
        const heading = getHeading(
            {
                x: currentStep.x - ship.x,
                y: currentStep.y - ship.y
            }
        )

        // reduce sails for tight turns
        // TO DO - should take account of ship's profile here
        const changeNeeded = findRotationBetweenHeadings(ship.h, heading)
        const sailLevelTarget = Math.abs(changeNeeded) > _DEG * 30
            ? 0
            : Math.abs(changeNeeded) > _DEG * 15 
                ? .5 
                : 1

        directives.push(
            { order: Order.SAILS_TO, quantity: sailLevelTarget },
            { order: Order.HEADING_TO, quantity: heading },
        )
    }

    return directives;
}