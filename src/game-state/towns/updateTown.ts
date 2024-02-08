import { updateCannon } from "../cannons";
import { createGroundHit, createImpact } from "../effects/effect";
import { DEFENCES_TO_REPEL_INVADERS, GameState, Projectile, REPAIR_PERIOD, Town } from "../model";
import { doRepairs } from "./town-ai";
import { townIsBeingInvaded } from "./town-functions";


export const updateTown = (town: Town, gameState: GameState) => {
    if (!townIsBeingInvaded(town, gameState)) {
        if (gameState.cycleNumber % REPAIR_PERIOD === 0) {
            doRepairs(town)
        }
    }
    town.forts.forEach(fort => {
        fort.cannons.forEach(updateCannon)
    })
}

export const damageTown = (town: Town, projectile: Projectile, gameState: GameState) => {
    if (town.defences < DEFENCES_TO_REPEL_INVADERS && town.garrison > 10) {
        town.garrison = Math.max(0, town.garrison - 1)
    }
    town.defences = Math.max(0, town.defences - 5)
    createGroundHit({ ...projectile, timeLeft: 80 }, gameState)
    createImpact({ ...projectile, timeLeft: 50 }, gameState)
}