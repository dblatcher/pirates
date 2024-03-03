import { GameState, Ship } from "../game-state";
import { XY } from "../lib/geometry";
import { CellMatrix } from "../lib/path-finding/types";

type MissionType = 'patrol' | 'follow' | 'travel' | 'hunt'

export type Mission = {
    type: MissionType,
    targetShipId?: number,
    waypoints?: XY[],
    waypointIndex?: number,
}

export type AIState = {
    mission: Mission;
    destination?: XY;
    path: XY[];
    lastCycleWithPathfinding?: number;
    followPoint?: {
        angle: number
        distance: number
        determinedAtCycle: number
    }
}

export type DescisonContext = {
    ship: Ship,
    gameState: GameState,
    matrix: CellMatrix,
    paddedMatrix: CellMatrix,
}