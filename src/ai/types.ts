import { GameState, Ship } from "../game-state";
import { XY } from "../lib/geometry";
import { CellMatrix } from "../lib/path-finding/types";

type MissionType = 'attack' | 'patrol' | 'follow'

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
}

export type DescisonContext = {
    ship: Ship,
    gameState: GameState,
    matrix: CellMatrix,
}