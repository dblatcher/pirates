import { Directive, Order, Ship, Side, anglesBySide } from "../../game-state"
import { getVectorFrom, getHeading, _90_DEG_LEFT, normaliseHeading, _DEG, XY, getDistance } from "../../lib/geometry"

export const approach = (
    target: XY,
    ship: Ship
): Directive[] => {

    const directives: Directive[] = []
    const vector = getVectorFrom(ship, target)
    const heading = getHeading(vector)

    directives.push({
        order: Order.HEADING_TO, quantity: heading
    })

    const differenceInAngle = Math.abs(normaliseHeading(heading) - normaliseHeading(ship.h))

    if (differenceInAngle < _DEG * 10) {
        directives.push({ order: Order.SAILS_TO, quantity: 1 })
    }

    return directives
}