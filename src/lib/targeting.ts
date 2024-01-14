import { Fort, Ship, Side, anglesBySide } from "../game-state"
import { getProwPosition, getAftPosition } from "../game-state/ship"
import { _DEG, getHeadingFrom, findRotationBetweenHeadings, getDistance } from "./geometry"

const HALF_FIRING_ARC = _DEG * 10

type Targeting = {
    ship: Ship
    isEnemy: boolean
    headingFromShip: number,
    headingToProw: number,
    headingToAft: number,
    distance: number,
}

export const buildInitialTargettingList = (shootist: Ship | Fort, enemies: Ship[], allies: Ship[]): Targeting[] => {
    return [
        ...enemies.map(enemy => ({
            ship: enemy,
            isEnemy: true,
            headingFromShip: getHeadingFrom(shootist, enemy),
            headingToProw: getHeadingFrom(shootist, getProwPosition(enemy)),
            headingToAft: getHeadingFrom(shootist, getAftPosition(enemy)),
            distance: Infinity,
        })),
        ...allies.map(ally => ({
            ship: ally,
            isEnemy: false,
            headingFromShip: getHeadingFrom(shootist, ally),
            headingToProw: getHeadingFrom(shootist, getProwPosition(ally)),
            headingToAft: getHeadingFrom(shootist, getAftPosition(ally)),
            distance: Infinity,
        })),
    ]
}


export const getShipsInArcNearestFirst = (shootistSide: Side | undefined, shootist: Ship | Fort, targettingList: Targeting[]): Targeting[] => {

    const headingChangeForSide = shootistSide ? anglesBySide[shootistSide] : 0;

    const targettingInArc = targettingList.filter(targetting => {
        const headingAtWhichShipIsOnTargetToFire = targetting.headingFromShip - headingChangeForSide
        const onAnotherSide = Math.abs(findRotationBetweenHeadings(shootist.h, headingAtWhichShipIsOnTargetToFire)) > 90 * _DEG;
        if (onAnotherSide) {
            return false
        }

        const headingAtWhichShipSideIsWouldBePointingAtTargetProw = targetting.headingToProw - headingChangeForSide
        const shipSideToProwDiff = findRotationBetweenHeadings(shootist.h, headingAtWhichShipSideIsWouldBePointingAtTargetProw)

        //Target prow is less than 15 degrees off broadside
        if (Math.abs(shipSideToProwDiff) < HALF_FIRING_ARC) {
            return true
        }

        const headingAtWhichShipSideIsWouldBePointingAtTargetAft = targetting.headingToAft - headingChangeForSide
        const shipSideToAftDiff = findRotationBetweenHeadings(shootist.h, headingAtWhichShipSideIsWouldBePointingAtTargetAft)
        //Target aft is less than 15 degrees off broadside
        if (Math.abs(shipSideToAftDiff) < HALF_FIRING_ARC) {
            return true
        }

        const shipCrossesTheLine = (Math.sign(shipSideToAftDiff) !== Math.sign(shipSideToProwDiff))
        return shipCrossesTheLine
    })
    targettingInArc.forEach(targetting => {
        targetting.distance = getDistance(targetting.ship, shootist)
    })
    targettingInArc.sort((a, b) => a.distance - b.distance)
    return targettingInArc
}
