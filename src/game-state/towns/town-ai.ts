import { identifyShips } from "../../ai/identify-ships";
import { findClosestAndDistance, getDistance, getHeading, getVectorFrom, getXYVector, translate } from "../../lib/geometry";
import { GameState, Town } from "../model";

export const aimAndFireCannonsFromForts = (town: Town, gameState: GameState) => {

    const { enemies } = identifyShips(town, gameState)
    const { item: closestEnemy } = findClosestAndDistance(enemies, town)

    if (closestEnemy) {


        town.forts.forEach(fort => {

            const cannonsReady = fort.cannons.filter(cannon => !cannon.countdown)
            if (cannonsReady.length === 0) {
                return
            }

            const position = translate(town, fort.distanceFromTown)
            const targetHeading = getHeading(getVectorFrom(position, closestEnemy))
            const targetDistance = getDistance(position, closestEnemy)
            fort.aimDirection = targetHeading

            if (targetDistance < 250) {
                // const projectPathEnd = translate(position, getXYVector(targetDistance, targetHeading))
                //TODO - this works but was too expensive - find more efficient solution based on angles
                // const mightHitTown = doesLineSegmentCrossCircleEdge([position, projectPathEnd], { ...town, r: TOWN_SIZE / 2 })
                
                if (!false) {
                    fort.cannons.forEach(cannon => {
                        if (cannon.cooldown <= 0) {
                            cannon.countdown = 1
                        }
                    })
                }
            }
        })
    }

}