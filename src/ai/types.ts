import { XY } from "../lib/geometry";

export type Mission = {
    type: string,
    targetShipId?: number,
    patrolPath?: XY[],
    patrolPointIndex?: number,
}

export type AIState = {
    mission: Mission;
    destination?: XY;
    path: XY[];
}