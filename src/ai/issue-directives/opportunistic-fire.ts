import { AI, DescisonContext } from ".."
import { DEFAULT_FIRE_DISTANCE, Directive, FiringPattern, Order, Ship, Side, allSides, descriptionsBySide } from "../../game-state"
import { describeShipWithId } from "../../game-state/ship"
import { buildInitialTargettingList, getShipsInArcNearestFirst } from "../../lib/targeting"
import { identifyShips } from "../identify-ships"


export const opportunisticFire = (ai: AI, { ship, gameState }: DescisonContext, preCalculatedShipsInRange?: { enemies: Ship[], allies: Ship[] }): Directive[] => {
    const { enemies, allies } = preCalculatedShipsInRange ?? identifyShips(ship, gameState, DEFAULT_FIRE_DISTANCE)
    const directives: Directive[] = []
    if (enemies.length === 0) {
        return directives
    }

    const cannonsReadyOn: Record<Side, boolean> = {
        [Side.LEFT]: ship.cannons.some(cannon => cannon.side === Side.LEFT && cannon.cooldown <= 0),
        [Side.RIGHT]: ship.cannons.some(cannon => cannon.side === Side.RIGHT && cannon.cooldown <= 0),
    }

    if (Object.values(cannonsReadyOn).every(readiness => readiness === false)) {
        return directives
    }

    const targettingList = buildInitialTargettingList(ship, enemies, allies)

    allSides.forEach(side => {
        if (cannonsReadyOn[side]) {
            const targettingListInArc = getShipsInArcNearestFirst(side, ship, targettingList)
            const [closestTargetInArc] = targettingListInArc
            if (closestTargetInArc?.isEnemy) {
                ai.debugLog(ship)(`Firing at ${describeShipWithId(closestTargetInArc.ship)} on my ${descriptionsBySide[side]}`)
                directives.push(
                    { order: Order.FIRE, side: side, pattern: FiringPattern.BROADSIDE },
                )
            } else if (closestTargetInArc) {
                ai.debugLog(ship)(`Not firing ${descriptionsBySide[side]} because ${describeShipWithId(closestTargetInArc.ship)} is closet in arc`)
            }
        }
    })

    return directives
}