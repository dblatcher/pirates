import { XY } from "../lib/geometry";

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