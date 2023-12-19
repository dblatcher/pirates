import { AI, DescisonContext } from ".."
import { Directive, FiringPattern, Order, Ship, Side, anglesBySide } from "../../game-state"
import { _DEG, findRotationBetweenHeadings, getHeadingFrom } from "../../lib/geometry"


export const opportunisticFire = (_ai: AI, { ship }: DescisonContext, enemies: Ship[]): Directive[] => {

    const directives: Directive[] = []

    if (enemies.length === 0 || ship.cannons.every(cannon => cannon.cooldown > 0)) {
        return directives
    }

    const targetsAndAngles = enemies.map(enemy => {
        const heading = getHeadingFrom(ship, enemy)

        const headingAtWhichShipIsOnTargetToFireLeft = heading - anglesBySide[Side.LEFT]
        const headingAtWhichShipIsOnTargetToFireRight = heading - anglesBySide[Side.RIGHT]

        return {
            enemy,
            leftDiff: Math.abs(findRotationBetweenHeadings(ship.h, headingAtWhichShipIsOnTargetToFireLeft)),
            rightDiff: Math.abs(findRotationBetweenHeadings(ship.h, headingAtWhichShipIsOnTargetToFireRight)),

        }
    })

    if (targetsAndAngles.find(target => target.rightDiff < 15 * _DEG)) {
        directives.push(
            { order: Order.FIRE, side: Side.RIGHT, pattern: FiringPattern.BROADSIDE },
        )
    }
    if (targetsAndAngles.find(target => target.leftDiff < 15 * _DEG)) {
        directives.push(
            { order: Order.FIRE, side: Side.LEFT, pattern: FiringPattern.BROADSIDE },
        )
    }

    return directives
}