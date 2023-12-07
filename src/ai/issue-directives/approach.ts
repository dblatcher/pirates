import { Directive, GameState, Order, Ship } from "../../game-state"
import { isLandAt } from "../../game-state/land"
import { XY, _DEG, getHeading, getHeadingFrom, getVectorFrom, normaliseHeading } from "../../lib/geometry"
import { stopAndTurnTowards } from "./stop-and-turn"



export const approach = (
    target: XY,
    ship: Ship,
    sailLevel?: number,
): Directive[] => {
    const directives: Directive[] = []
    const vector = getVectorFrom(ship, target)
    const heading = getHeading(vector)

    directives.push({
        order: Order.HEADING_TO, quantity: heading
    })
    const differenceInAngle = Math.abs(normaliseHeading(heading) - normaliseHeading(ship.h))
    if (differenceInAngle < _DEG * 10) {
        directives.push({ order: Order.SAILS_TO, quantity: typeof sailLevel === 'number' ? sailLevel : 1 })
    }

    return directives
}

export const approachUnlessBlocked = (
    gameState: GameState,
    target: XY,
    ship: Ship,
    sailLevel?: number,
): Directive[] => {

    const blocked = isLandAt(target, gameState.land) // TO DO - check forts!
    const isDirectPath = true // TODO - check if no land is in the way - need to be very efficient, not check every cycle or store the result somehow

    if (blocked) {
        return stopAndTurnTowards(getHeadingFrom(ship, target))
    }
    if (!isDirectPath) {
        return [
            { order: Order.SET_AI_DESTINATION, target }, 
            ...stopAndTurnTowards(getHeadingFrom(ship, target))
        ]
    }
    return approach(target, ship, sailLevel)
}