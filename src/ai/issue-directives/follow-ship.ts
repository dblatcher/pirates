import { AI, DescisonContext } from "..";
import { DISTANCE_TO_REEVAULATE_PATH, Directive, GameState, Ship } from "../../game-state";
import { calculateRequiredSailLevel, getSpeed } from "../../game-state/ship/calculate-speed";
import { XY, _DEG, getDistance, getHeadingFrom, getXYVector, translate, xy } from "../../lib/geometry";
import { approach, approachOrFindIndirectPathUnlessBlocked } from "./approach";
import { followCurrentPath } from "./follow-path";
import { stopAndTurnTowards } from "./stop-and-turn";

enum FollowPlan {
    CatchUp, MatchSpeed, ReachTargetPoint, Stop, UseCurrentPath,
}


const determinePlanToEscort = (
    ai: AI, ship: Ship, shipToFollow: Ship, distanceToOtherShip: number, gameState: GameState,
): { plan: FollowPlan, targetPoint: XY, targetSpeed: number } => {

    const targetSpeed = getSpeed(shipToFollow, gameState)

    if (ai.state.destination) {
        return {
            plan: FollowPlan.UseCurrentPath,
            targetSpeed,
            targetPoint: ai.state.destination,
        }
    }


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
        return { plan: FollowPlan.CatchUp, targetPoint, targetSpeed }
    }
    if (distanceToOtherShip > distanceToStopAt && targetSpeed > 0) {
        return { plan: FollowPlan.MatchSpeed, targetPoint, targetSpeed }
    }
    if (distanceToOtherShip > distanceToStopAt && getDistance(ship, targetPoint) > 50) {
        return { plan: FollowPlan.ReachTargetPoint, targetPoint, targetSpeed }
    }
    return { plan: FollowPlan.Stop, targetPoint, targetSpeed }
}

export const determinePlanToHunt = (
    ai: AI, _ship: Ship, shipToFollow: Ship, _distanceToOtherShip: number, _gameState: GameState,
): { plan: FollowPlan, targetPoint: XY, targetSpeed: number } => {

    const targetPoint = xy(shipToFollow.x, shipToFollow.y)
    const targetSpeed = 1

    if (ai.state.destination) {
        return {
            plan: FollowPlan.UseCurrentPath,
            targetSpeed,
            targetPoint: ai.state.destination,
        }
    }

    return { plan: FollowPlan.CatchUp, targetPoint, targetSpeed }
}

export const followShip = (
    ai: AI,
    context: DescisonContext,
    shipToFollow: Ship, distanceToOtherShip: number,
): Directive[] => {
    const { gameState, ship } = context
    const distanceBetweenTargetAndDestination = ai.state.destination ? getDistance(ai.state.destination, shipToFollow) : 0
    if (distanceBetweenTargetAndDestination > DISTANCE_TO_REEVAULATE_PATH) {
        ai.debugLog(`target is ${distanceBetweenTargetAndDestination.toFixed(0)} from current destination - clearing`)
        ai.setDestination(undefined)
    }

    // TO DO - do we want to use the mission tyep this way?
    const { plan, targetPoint, targetSpeed } = ai.state.mission.type === 'hunt'
        ? determinePlanToHunt(ai, ship, shipToFollow, distanceToOtherShip, gameState)
        : determinePlanToEscort(ai, ship, shipToFollow, distanceToOtherShip, gameState)

    switch (plan) {
        case FollowPlan.CatchUp:
            return approachOrFindIndirectPathUnlessBlocked(ai, context, targetPoint, 1)
        case FollowPlan.MatchSpeed:
            return approachOrFindIndirectPathUnlessBlocked(ai, context, targetPoint, calculateRequiredSailLevel(targetSpeed, ship, gameState))
        case FollowPlan.ReachTargetPoint:
            return approach(context, targetPoint, calculateRequiredSailLevel(.75, ship, gameState))
        case FollowPlan.UseCurrentPath:
            return followCurrentPath(ai, context)
        case FollowPlan.Stop:
            return stopAndTurnTowards(getHeadingFrom(ship, shipToFollow))
    }
}