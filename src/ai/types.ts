import { XY } from "../lib/geometry";

export type Mission {
    type: string
}

export type AIState = {
    mission: Mission;
    destination?: XY;
    path?: XY[];
}