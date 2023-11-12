import { TERRAIN_SQUARE_SIZE } from "../../game-state/land"
import { Ship } from "../../game-state/ship"
import { Directive, Order } from "../../game-state/types"
import { _DEG, findRotationBetweenHeadings, getDistance, getHeading } from "../../lib/geometry"
import { AI } from "../base-class"

export const followCurrentPath = (ai: AI, ship: Ship): Directive[] => {
    const [currentStep] = ai.state.path

    // PATH IS FINISHED, ALL STOP
    if (!currentStep) {
        return [
            { order: Order.SAILS_TO, quantity: 0 },
            { order: Order.RESET_WHEEL },
        ]
    }

    const heading = getHeading({
        x: currentStep.x - ship.x,
        y: currentStep.y - ship.y
    })
    const distance = getDistance(ship, currentStep)
    const close = distance < TERRAIN_SQUARE_SIZE * .75

    // reduce sails for tight turns
    // TO DO - should take account of ship's profile here
    const changeNeeded = findRotationBetweenHeadings(ship.h, heading)
    const sailLevelTarget = close
        ? Math.abs(changeNeeded) > _DEG * 30
            ? 0
            : .25
        : Math.abs(changeNeeded) > _DEG * 30
            ? 0
            : Math.abs(changeNeeded) > _DEG * 15
                ? .5
                : 1

    return [
        { order: Order.SAILS_TO, quantity: sailLevelTarget },
        { order: Order.HEADING_TO, quantity: heading },
    ]
}