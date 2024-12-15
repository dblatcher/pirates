import { Ship, Fort, } from "../model"
import { getFrontCollisionCircle, getProwPosition, getCollisionCircles, getRearCollisionCircle, getAftPosition } from "./collision-shapes"
import { XY, normaliseHeading } from "../../lib/geometry"
import { willShipRunIntoOtherShip, willShipRunIntoFort, willShipOverlapWithOtherShip, willShipOverlapWithFort } from "../collisions"
import { Landmass, isLandAt } from "../land"


const detectMoveCollisions = (backwards: boolean, ship: Ship, vector: XY, otherShipsNearby: Ship[], forts: Fort[], land: Landmass[]) => {
    const shipCopyAfterMove = { ...ship, x: ship.x + vector.x, y: ship.y + vector.y }
    const shipLeadingCircleAfterMove = backwards ? getRearCollisionCircle(shipCopyAfterMove) : getFrontCollisionCircle(shipCopyAfterMove)
    const shipLeadingPointAfterMove = backwards ? getAftPosition(shipCopyAfterMove) : getProwPosition(shipCopyAfterMove)
    const otherShipRanInto = otherShipsNearby.find(otherShip =>
        willShipRunIntoOtherShip(shipLeadingCircleAfterMove, otherShip)
    )
    const runsAground = isLandAt(shipLeadingPointAfterMove, land)
    const fortRunInto = forts.find(fort =>
        willShipRunIntoFort(shipLeadingCircleAfterMove, fort)
    )
    return { otherShipRanInto, runsAground, fortRunInto }
}

export const detectForwardCollisions = (ship: Ship, vector: XY, otherShipsNearby: Ship[], forts: Fort[], land: Landmass[]) => {
    return detectMoveCollisions(false, ship, vector, otherShipsNearby, forts, land)
}

export const detectBackwardsCollisions = (ship: Ship, vector: XY, otherShipsNearby: Ship[], forts: Fort[], land: Landmass[]) => {
    return detectMoveCollisions(true, ship, vector, otherShipsNearby, forts, land)
}

export const detectTurningCollisons = (ship: Ship, turnAmount: number, otherShipsNearby: Ship[], forts: Fort[]) => {
    const newHeading = normaliseHeading(ship.h + turnAmount)
    const collisionCirclesAfterTurn = getCollisionCircles({ ...ship, h: newHeading })
    const otherShipTurnedInto = turnAmount !== 0 && otherShipsNearby.find(otherShip =>
        willShipOverlapWithOtherShip(collisionCirclesAfterTurn, otherShip))
    const fortTurnedInto = forts.find(fort => {
        return willShipOverlapWithFort(collisionCirclesAfterTurn, fort)
    })
    return { otherShipTurnedInto, fortTurnedInto }
}