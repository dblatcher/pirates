import { Directive, Order } from "../../game-state"
import { isLandAt } from "../../game-state/land"
import { XY, _DEG, getHeading, getHeadingFrom, getVectorFrom, normaliseHeading } from "../../lib/geometry"
import { isDirectPathTo } from "../../lib/path-finding/direct-route"
import { DescisonContext } from "../types"
import { stopAndTurnTowards } from "./stop-and-turn"



export const approach = (
    { ship }: DescisonContext,
    target: XY,
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

export const approachOrFindIndirectPathUnlessBlocked = (
    context: DescisonContext,
    target: XY,
    sailLevel?: number,
): Directive[] => {
    const { ship, gameState, matrix } = context
    const blocked = isLandAt(target, gameState.land) // TO DO - check forts!
    if (blocked) {
        return stopAndTurnTowards(getHeadingFrom(ship, target))
    }

    const isDirectPath = isDirectPathTo(target, ship, matrix) // TODO - check if no land is in the way - need to be very efficient, not check every cycle or store the result somehow
    if (!isDirectPath) {
        // console.log('no direct path, will plot route')
        return [
            { order: Order.SET_AI_DESTINATION, target },
            ...stopAndTurnTowards(getHeadingFrom(ship, target))
        ]
    }
    return approach(context, target, sailLevel)
}