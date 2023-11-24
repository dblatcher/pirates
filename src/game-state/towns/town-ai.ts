import { identifyShips } from "../../ai/identify-ships";
import { doesLineSegmentCrossCircleEdge } from "../../lib/expensive-geometry";
import { findClosestAndDistance, getDistance, getHeading, getVectorFrom, getXYVector, translate } from "../../lib/geometry";
import { clamp } from "../../lib/util";
import { DAMAGE_THAT_STOPS_FORTS_FIRING, GameState, MAXIMUM_DAMAGE_A_FORT_TAKES, TOWN_SIZE, Town } from "../model";


export const doRepairs = (town: Town) => {
    if (town.defences < town.profile.maxDefences) {
        town.defences = Math.min(town.defences + 1, town.profile.maxDefences)
        return
    }
    if (town.forts.some(fort => fort.damage >= DAMAGE_THAT_STOPS_FORTS_FIRING)) {
        const [mostDamaged] = town.forts.sort((a, b) => b.damage - a.damage)
        mostDamaged.damage = clamp(mostDamaged.damage - 1, MAXIMUM_DAMAGE_A_FORT_TAKES)
    }
    if (town.garrison < town.profile.maxGarrison) {
        town.garrison = Math.min(town.garrison + 1, town.profile.maxGarrison)
        return
    }
    const [mostDamaged] = town.forts.sort((a, b) => b.damage - a.damage)
    if (mostDamaged) { // town may have zero forts
        mostDamaged.damage = clamp(mostDamaged.damage - 1, MAXIMUM_DAMAGE_A_FORT_TAKES)
    }
}

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
                const projectPathEnd = translate(position, getXYVector(targetDistance, targetHeading))
                //TODO - this works but is too expensive - find more efficient solution based on angles
                // can figure out the town angle once and store on an optional proprty of the fort
                const mightHitTown = doesLineSegmentCrossCircleEdge([position, projectPathEnd], { ...town, r: TOWN_SIZE / 2 })
                
                if (!mightHitTown) {
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