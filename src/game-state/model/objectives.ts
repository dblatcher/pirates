import { XY } from "../../lib/geometry";

export type Objective = XY & {
    name: string,
    obtained?: boolean,
}

