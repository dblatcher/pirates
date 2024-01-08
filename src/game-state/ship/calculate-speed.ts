import { findRotationBetweenHeadings } from "../../lib/geometry";
import { clamp } from "../../lib/util";
import { BASE_SPEED_MULTIPLIER, GameState, MAX_WIND, MINIMUM_SPEED_FACTOR_DUE_TO_DAMAGE, SHIP_DAMAGE_LEVEL_THAT_SLOWS } from "../model";
import { Ship } from "../model";

export const getSpeed = (ship: Ship, gameState: GameState): number => {
    const { wind } = gameState

    const headingWindDifference = findRotationBetweenHeadings(ship.h, wind.direction)

    /** value from 0 to 1 describing how much the wind is against the direction of travel */
    const directionDifferenceNormalised = Math.abs(headingWindDifference) / (Math.PI)

    // TO DO - game logic question - should wind blowing in the opposite direction stop ships?
    // should strong wind be a negative when blowing the wrong way?
    // make them go backwards? What makes for the  most FUN?
    const windForceFactor = 2 * (wind.force / MAX_WIND)
    const windFactor = (1 - (directionDifferenceNormalised / 2)) * windForceFactor


    const damagelevel = ship.damage / ship.profile.maxHp
    const unclampedFactor = ((1 / (SHIP_DAMAGE_LEVEL_THAT_SLOWS - 1)) * damagelevel) - (1 / (SHIP_DAMAGE_LEVEL_THAT_SLOWS - 1))
    const damageFactor = clamp(unclampedFactor, 1, MINIMUM_SPEED_FACTOR_DUE_TO_DAMAGE)

    return ship.sailLevel * ship.profile.speed * windFactor * damageFactor * BASE_SPEED_MULTIPLIER
}

const getSpeedAtFullSail = (ship: Ship, gameState: GameState): number => {
    return getSpeed({ ...ship, sailLevel: 1 }, gameState)
}

export const calculateRequiredSailLevel = (targetSpeed: number, ship: Ship, gameState: GameState): number => {
    if (targetSpeed <= 0) { return 0 }
    const speedAtFullSail = getSpeedAtFullSail(ship, gameState)
    return targetSpeed > speedAtFullSail ? 1 : targetSpeed / speedAtFullSail
}