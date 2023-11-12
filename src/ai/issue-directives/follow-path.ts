import { Ship } from "../../game-state/ship"
import { Directive, Order } from "../../game-state/types"
import { _DEG, findRotationBetweenHeadings, getHeading } from "../../lib/geometry"
import { AI } from "../base-class"

export const followCurrentPath = (ai: AI, ship: Ship): Directive[] => {
    const [currentStep] = ai.state.path

    if (!currentStep) {
        // PATH IS FINISHED, ALL STOP
        return [
            { order: Order.SAILS_TO, quantity: 0 },
            { order: Order.RESET_WHEEL },
        ]
    }

    const heading = getHeading(
        {
            x: currentStep.x - ship.x,
            y: currentStep.y - ship.y
        }
    )

    // reduce sails for tight turns
    // TO DO - should take account of ship's profile here
    // TO DO - should also take account of distance -  when very close, drop sails until turned  to avoid going round in circles
    const changeNeeded = findRotationBetweenHeadings(ship.h, heading)
    const sailLevelTarget = Math.abs(changeNeeded) > _DEG * 30
        ? 0
        : Math.abs(changeNeeded) > _DEG * 15
            ? .5
            : 1

    return [
        { order: Order.SAILS_TO, quantity: sailLevelTarget },
        { order: Order.HEADING_TO, quantity: heading },
    ]


}