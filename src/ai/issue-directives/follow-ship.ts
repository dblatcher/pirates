import { AI } from "..";
import { Directive, GameState, Order, Ship } from "../../game-state";
import { getSpeed, calculateRequiredSailLevel } from "../../game-state/ship/calculate-speed";
import { _DEG, translate, getXYVector, getDistance, getHeadingFrom } from "../../lib/geometry";
import { approach } from "./approach";

enum FollowPlan {
    CatchUp, MatchSpeed, ReachTargetPoint, Stop
}


export const followShip = (_ai: AI, ship: Ship, shipToFollow: Ship, distanceToOtherShip: number, gameState: GameState): Directive[] => {

    let plan: FollowPlan = FollowPlan.Stop;

    const targetSpeed = getSpeed(shipToFollow, gameState)

    // TO DO - determine at what angle to follow the ship
    // so multiple ships can follow the same ship without crashing into each other
    // all the time
    const chaseAngle = _DEG * 0
    const combinedRadi = ship.length / 2 + shipToFollow.length / 2

    const targetDistance = 100 + combinedRadi
    const targetPoint = translate(shipToFollow, getXYVector(-targetDistance, shipToFollow.h + chaseAngle))
    const distanceToStopAt = 25 + combinedRadi
    const distanceToCatchUpAt = 150 + combinedRadi

    if (distanceToOtherShip > distanceToCatchUpAt) {
        plan = FollowPlan.CatchUp
    } else if (distanceToOtherShip > distanceToStopAt && targetSpeed > 0) {
        plan = FollowPlan.MatchSpeed
    } else if (distanceToOtherShip > distanceToStopAt && getDistance(ship, targetPoint) > 50) {
        plan = FollowPlan.ReachTargetPoint
    } else {
        plan = FollowPlan.Stop
    }

    switch (plan) {
        case FollowPlan.CatchUp:
            return approach(targetPoint, ship, 1)
        case FollowPlan.MatchSpeed:
            return approach(targetPoint, ship, calculateRequiredSailLevel(targetSpeed, ship, gameState))
        case FollowPlan.ReachTargetPoint:
            return approach(targetPoint, ship, calculateRequiredSailLevel(.75, ship, gameState))
        case FollowPlan.Stop:
            return [
                { order: Order.SAILS_TO, quantity: 0 },
                { order: Order.HEADING_TO, quantity: getHeadingFrom(ship, shipToFollow) }
            ]
    }

}