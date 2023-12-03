import { Directive, Order, Ship } from "../../game-state"
import { XY, _DEG, getHeading, getVectorFrom, normaliseHeading } from "../../lib/geometry"

export const approach = (
    target: XY,
    ship: Ship,
    sailLevel?: number,
): Directive[] => {

    const directives: Directive[] = []
    const vector = getVectorFrom(ship, target)
    const heading = getHeading(vector)

    directives.push({
        order: Order.HEADING_TO, quantity: heading
    })

    const differenceInAngle = Math.abs(normaliseHeading(heading) - normaliseHeading(ship.h))

    if (differenceInAngle < _DEG * 10) {
        directives.push({ order: Order.SAILS_TO, quantity: typeof sailLevel === 'number' ? sailLevel : 1 })
    }

    return directives
}