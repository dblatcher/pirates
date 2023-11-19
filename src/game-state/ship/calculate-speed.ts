import { findRotationBetweenHeadings } from "../../lib/geometry";
import { GameState, MAX_WIND } from "../model/types";
import { Ship } from "./types";


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
    return ship.sailLevel * ship.profile.speed * windFactor
}