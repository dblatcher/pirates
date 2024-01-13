import { AI, DescisonContext } from ".."
import { DEFAULT_FIRE_DISTANCE, Directive, FiringPattern, Order, Ship, Side, anglesBySide } from "../../game-state"
import { describeShipWithId } from "../../game-state/ship"
import { _DEG, findRotationBetweenHeadings, getHeadingFrom } from "../../lib/geometry"
import { identifyShips } from "../identify-ships"

/** TO DO - don't fire if there is an ally closer than the target, on the same side */
export const opportunisticFire = (ai: AI, { ship, gameState }: DescisonContext, preCalculatedShipsInRange?: { enemies: Ship[], allies: Ship[] }): Directive[] => {
    const { enemies } = preCalculatedShipsInRange ?? identifyShips(ship, gameState, DEFAULT_FIRE_DISTANCE)
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


    const validTargetOnRight = targetsAndAngles.find(target => target.rightDiff < 15 * _DEG)
    if (validTargetOnRight) {
        ai.debugLog(`Firing at ${describeShipWithId(validTargetOnRight.enemy)} on my right`)
        directives.push(
            { order: Order.FIRE, side: Side.RIGHT, pattern: FiringPattern.BROADSIDE },
        )
    }

    if (ship.cannons.some(cannon => cannon.side === Side.LEFT && cannon.cooldown <= 0)) {
        const validTargetOnLeft = targetsAndAngles.find(target => target.leftDiff < 15 * _DEG)
        if (validTargetOnLeft) {
            ai.debugLog(`Firing at ${describeShipWithId(validTargetOnLeft.enemy)} on my left`)
            directives.push(
                { order: Order.FIRE, side: Side.LEFT, pattern: FiringPattern.BROADSIDE },
            )
        }
    }

    return directives
}