import { Ship } from "./types";
import { GameState, MAX_WIND } from "../types";
import { _DEG, normaliseHeading } from "../../lib/geometry";


export const getSpeed = (ship: Ship, gameState: GameState): number => {
    const { wind } = gameState
    const directionDifferenceRads = (Math.abs(normaliseHeading(ship.h) - normaliseHeading(wind.direction)))
    const directionDifferenceNormalised = directionDifferenceRads / (Math.PI)

    // TO DO - game logic question - should wind blowing in the opposite direction stop ships?
    // should strong wind be a negative when blowing the wrong way?
    // make them go backwards? What makes for the  most FUN?
    const windForceFactor = 2 * (wind.force / MAX_WIND)
    const windFactor = (1 - (directionDifferenceNormalised / 2)) * windForceFactor
    return ship.sailLevel * ship.profile.speed * windFactor
}