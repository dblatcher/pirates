import { Ship } from "../../game-state/ship"
import { Directive, Order } from "../../game-state/types"
import { getDistance, getHeading } from "../../lib/geometry"
import { AI } from "../base-class"

export const followCurrentPath = (ai:AI, ship: Ship) : Directive[] => {

    const directives: Directive[] = []
    const [currentStep] = ai.state.path

    if (!currentStep) {
        directives.push(
            { order: Order.SAILS_TO, quantity: 0 },
            { order: Order.RESET_WHEEL },
        )
    } else if (getDistance(ship, currentStep) < 10) {
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
        directives.push(
            { order: Order.SAILS_TO, quantity: .5 },
            { order: Order.HEADING_TO, quantity: heading },
        )
    }

    return directives;
}