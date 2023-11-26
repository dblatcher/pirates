import { Ship, Fort, } from "../model"
import { geLeadingCollisionCircle, getProwPosition, getCollisionCircles } from "./collision-shapes"
import { XY, normaliseHeading } from "../../lib/geometry"
import { willShipRunIntoOtherShip, willShipRunIntoFort, willShipOverlapWithOtherShip, willShipOverlapWithFort } from "../collisions"
import { Landmass, isLandAt } from "../land"

export const detectForwardCollisions = (ship: Ship, forward: XY, otherShipsNearby: Ship[], forts: Fort[], land: Landmass[]) => {
    const shipCopyAfterGoForward = { ...ship, x: ship.x + forward.x, y: ship.y + forward.y }
    const shipLeadingCircleAfterGoForward = geLeadingCollisionCircle(shipCopyAfterGoForward)
    const prowAfterGoForward = getProwPosition(shipCopyAfterGoForward)
    const otherShipRanInto = otherShipsNearby.find(otherShip =>
        willShipRunIntoOtherShip(shipLeadingCircleAfterGoForward, otherShip)
    )
    const runsAgroundFromGoingForward = isLandAt(prowAfterGoForward, land)
    const fortRunInto = forts.find(fort =>
        willShipRunIntoFort(shipLeadingCircleAfterGoForward, fort)
    )
    return { otherShipRanInto, runsAgroundFromGoingForward, fortRunInto }
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