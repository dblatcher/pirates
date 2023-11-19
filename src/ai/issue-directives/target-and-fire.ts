import { Directive, FiringPattern, Order, Ship, Side, anglesBySide } from "../../game-state"
import { getVectorFrom, getHeading, _90_DEG_LEFT, normaliseHeading, _DEG, XY, getDistance } from "../../lib/geometry"

export const turnToAndFire = (
    firingOrders: {
        target: XY;
        range?: number;
        side?: Side;
        maxRange?: number;
        maxAngle?: number;
    },
    ship: Ship
): Directive[] => {

    const directives: Directive[] = []

    const {
        target,
        range = getDistance(ship, target),
        side = Side.RIGHT,
        maxRange = 150,
        maxAngle = 20 * _DEG,
    } = firingOrders

    const vector = getVectorFrom(ship, target)
    const heading = getHeading(vector)

    const targetDirection = heading - anglesBySide[side]

    directives.push({
        order: Order.HEADING_TO, quantity: targetDirection
    })

    const differenceInAngle = Math.abs(normaliseHeading(targetDirection) - normaliseHeading(ship.h))

    if (range <= maxRange && differenceInAngle < maxAngle) {
        directives.push({ order: Order.FIRE, side, pattern: FiringPattern.BROADSIDE })
    }

    return directives
}