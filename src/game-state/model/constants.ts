import { _DEG } from "../../lib/geometry";

// sizes
export const TERRAIN_SQUARE_SIZE = 50
export const TOWN_SIZE = 100
export const FORT_SIZE = TERRAIN_SQUARE_SIZE

// rules
export const DEFENCES_TO_REPEL_INVADERS = 20
export const INVASION_RANGE = 100
export const REPAIR_RANGE = 200
export const DAMAGE_THAT_STOPS_FORTS_FIRING = 5
export const MAXIMUM_DAMAGE_A_FORT_TAKES = 15
export const REPAIR_PERIOD = 25
export const BATTLE_PERIOD = 25


// enviromental
export const MAX_WIND = 10;

export const BASE_SPEED_MULTIPLIER = 1.5
export const SAIL_CHANGE_RATE = .01
export const SHIP_TURN_RATE = _DEG * 2.5
/**The level of damage that starts to slow a ship */
export const SHIP_DAMAGE_LEVEL_THAT_SLOWS = .5
export const MINIMUM_SPEED_FACTOR_DUE_TO_DAMAGE = .2



// ai settings
export const DEFAULT_ATTACK_RANGE = 600
/** How close a pursuing ship will get to its target before trying to turn and fire */
export const DEFAULT_FIRE_DISTANCE = 150
/**How far a ship's actual target can get from the ship's current destination before the ship should set a new path */
export const DISTANCE_TO_REEVAULATE_PATH = 300
export const MIN_CYCLES_BETWEEN_PATH_FINDING = 50
/** How close ship needs to be for a fort to aim at it */
export const FORT_AIM_DISTANCE = 400
/** How close ship needs to be for a fort to fire at it */
export const FORT_FIRE_DISTANCE = 250

// effects
export const CYCLES_TO_SINK = 100
export const SINKING_DISTANCE = 50