import { AI, DescisonContext } from ".."
import { DEFAULT_FIRE_DISTANCE, Directive, FiringPattern, Order, Ship, Side, allSides, anglesBySide, descriptionsBySide } from "../../game-state"
import { describeShipWithId } from "../../game-state/ship"
import { _DEG, findRotationBetweenHeadings, getDistance, getHeadingFrom } from "../../lib/geometry"
import { identifyShips } from "../identify-ships"


type Targeting = {
    ship: Ship
    isEnemy: boolean
    headingFromShip: number,
    distance: number,
}

const buildInitialTargettingList = (ship: Ship, enemies: Ship[], allies: Ship[]): Targeting[] => {
    return [
        ...enemies.map(enemy => ({
            ship: enemy,
            isEnemy: true,
            headingFromShip: getHeadingFrom(ship, enemy),
            distance: Infinity,
        })),
        ...allies.map(ally => ({
            ship: ally,
            isEnemy: false,
            headingFromShip: getHeadingFrom(ship, ally),
            distance: Infinity,
        })),
    ]
}


// TO DO - this treats ships as points - only considers if the midpoint of the ship is in the arc. Need to consider prow and aft positions
const getShipsInArcNearestFirst = (side: Side, ship: Ship, targettingList: Targeting[]): Targeting[] => {
    const targettingInArc = targettingList.filter(targetting => {
        const headingAtWhichShipIsOnTargetToFire = targetting.headingFromShip - anglesBySide[side]
        const difference = Math.abs(findRotationBetweenHeadings(ship.h, headingAtWhichShipIsOnTargetToFire));
        return difference < 15 * _DEG
    })
    targettingInArc.forEach(targetting => {
        targetting.distance = getDistance(targetting.ship, ship)
    })
    targettingInArc.sort((a, b) => a.distance - b.distance)
    return targettingInArc
}

/** to do - consider ships' shape - currently treated as points */
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
                ai.debugLog(`Firing at ${describeShipWithId(closestTargetInArc.ship)} on my ${descriptionsBySide[side]}`)
                directives.push(
                    { order: Order.FIRE, side: side, pattern: FiringPattern.BROADSIDE },
                )
            } else if (closestTargetInArc) {
                ai.debugLog(`Not firing ${descriptionsBySide[side]} because ${describeShipWithId(closestTargetInArc.ship)} is closet in arc`)
            }
        }
    })

    return directives
}