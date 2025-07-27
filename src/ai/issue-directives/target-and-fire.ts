import { DescisonContext } from "../types"
import { DEFAULT_FIRE_DISTANCE, Directive, FiringPattern, Order, Ship, Side, anglesBySide } from "../../game-state"
import { getVectorFrom, getHeading, normaliseHeading, _DEG, XY, getDistance } from "typed-geometry"

const pickSideToUse = (firingShip: Ship, headingToTarget: number): Side => {
    const aimDirectionToFireFromLeft = headingToTarget - anglesBySide[Side.LEFT]
    const aimDirectionToFireFromRight = headingToTarget - anglesBySide[Side.RIGHT]
    const amountToTurnToFireLeft = Math.abs(normaliseHeading(aimDirectionToFireFromLeft) - normaliseHeading(firingShip.h))
    const amountToTurnToFireRight = Math.abs(normaliseHeading(aimDirectionToFireFromRight) - normaliseHeading(firingShip.h))
    return amountToTurnToFireLeft < amountToTurnToFireRight ? Side.LEFT : Side.RIGHT
}

// TO DO - use the logic in oppurtunistic fire (or similar) to avoid firing
// when an friendly ship is in the way
export const turnToAndFire = (
    { ship }: DescisonContext,
    firingOrders: {
        target: XY;
        range?: number;
        side?: Side;
        maxRange?: number;
        maxAngle?: number;
    },
): Directive[] => {

    const directives: Directive[] = []

    const {
        target,
        range = getDistance(ship, target),
        side,
        maxRange = DEFAULT_FIRE_DISTANCE,
        maxAngle = 20 * _DEG,
    } = firingOrders

    const vector = getVectorFrom(ship, target)
    const headingToTarget = getHeading(vector)

    const sideToFireFrom = side || pickSideToUse(ship, headingToTarget)
    const aimDirection = headingToTarget - anglesBySide[sideToFireFrom]

    directives.push({
        order: Order.HEADING_TO, quantity: aimDirection
    })

    const differenceInAngle = Math.abs(normaliseHeading(aimDirection) - normaliseHeading(ship.h))

    if (range <= maxRange && differenceInAngle < maxAngle) {
        directives.push({ order: Order.FIRE, side: sideToFireFrom, pattern: FiringPattern.BROADSIDE })
    }

    return directives
}