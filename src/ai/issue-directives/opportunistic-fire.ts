import { AI, DescisonContext } from ".."
import { DEFAULT_FIRE_DISTANCE, Directive, FiringPattern, Order, Ship, Side, allSides, anglesBySide, descriptionsBySide } from "../../game-state"
import { describeShipWithId, getAftPosition, getProwPosition } from "../../game-state/ship"
import { _DEG, findRotationBetweenHeadings, getDistance, getHeadingFrom } from "../../lib/geometry"
import { identifyShips } from "../identify-ships"


const HALF_FIRING_ARC = _DEG * 10

type Targeting = {
    ship: Ship
    isEnemy: boolean
    headingFromShip: number,
    headingToProw: number,
    headingToAft: number,
    distance: number,
}

const buildInitialTargettingList = (ship: Ship, enemies: Ship[], allies: Ship[]): Targeting[] => {
    return [
        ...enemies.map(enemy => ({
            ship: enemy,
            isEnemy: true,
            headingFromShip: getHeadingFrom(ship, enemy),
            headingToProw: getHeadingFrom(ship, getProwPosition(enemy)),
            headingToAft: getHeadingFrom(ship, getAftPosition(enemy)),
            distance: Infinity,
        })),
        ...allies.map(ally => ({
            ship: ally,
            isEnemy: false,
            headingFromShip: getHeadingFrom(ship, ally),
            headingToProw: getHeadingFrom(ship, getProwPosition(ally)),
            headingToAft: getHeadingFrom(ship, getAftPosition(ally)),
            distance: Infinity,
        })),
    ]
}


// TO DO - this treats ships as points - only considers if the midpoint of the ship is in the arc. Need to consider prow and aft positions
const getShipsInArcNearestFirst = (side: Side, ship: Ship, targettingList: Targeting[]): Targeting[] => {
    const targettingInArc = targettingList.filter(targetting => {
        const headingAtWhichShipIsOnTargetToFire = targetting.headingFromShip - anglesBySide[side]
        const onAnotherSide = Math.abs(findRotationBetweenHeadings(ship.h, headingAtWhichShipIsOnTargetToFire)) > 90 * _DEG;
        if (onAnotherSide) {
            return false
        }

        const headingAtWhichShipSideIsWouldBePointingAtTargetProw = targetting.headingToProw - anglesBySide[side]
        const shipSideToProwDiff = findRotationBetweenHeadings(ship.h, headingAtWhichShipSideIsWouldBePointingAtTargetProw)

        //Target prow is less than 15 degrees off broadside
        if (Math.abs(shipSideToProwDiff) < HALF_FIRING_ARC) {
            return true
        }

        const headingAtWhichShipSideIsWouldBePointingAtTargetAft = targetting.headingToAft - anglesBySide[side]
        const shipSideToAftDiff = findRotationBetweenHeadings(ship.h, headingAtWhichShipSideIsWouldBePointingAtTargetAft)
        //Target aft is less than 15 degrees off broadside
        if (Math.abs(shipSideToAftDiff) < HALF_FIRING_ARC) {
            return true
        }

        const shipCrossesTheLine = (Math.sign(shipSideToAftDiff) !== Math.sign(shipSideToProwDiff))
        return shipCrossesTheLine
    })
    targettingInArc.forEach(targetting => {
        targetting.distance = getDistance(targetting.ship, ship)
    })
    targettingInArc.sort((a, b) => a.distance - b.distance)
    return targettingInArc
}

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