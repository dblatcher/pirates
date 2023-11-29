import { _DEG } from "../../lib/geometry";

export const TERRAIN_SQUARE_SIZE = 50
export const TOWN_SIZE = 100
export const FORT_SIZE = TERRAIN_SQUARE_SIZE

export const DEFENCES_TO_REPEL_INVADERS = 20
export const INVASION_RANGE = 100
export const REPAIR_RANGE = 200
export const DAMAGE_THAT_STOPS_FORTS_FIRING = 5
export const MAXIMUM_DAMAGE_A_FORT_TAKES = 15

export const MAX_WIND = 10;

export const SAIL_CHANGE_RATE = .01
export const SHIP_TURN_RATE = _DEG * 2.5
/**The level of damage that starts to slow a ship */
export const SHIP_DAMAGE_LEVEL_THAT_SLOWS = .5

export const REPAIR_PERIOD = 25
export const BATTLE_PERIOD = 25