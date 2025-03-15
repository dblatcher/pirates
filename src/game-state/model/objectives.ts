import { XY } from "../../lib/geometry";
import { Flag } from "./game-types";

export type Objective = XY & {
    name: string,
    obtained?: boolean,
    flag?: Flag,
    flagColorOne?: string,
    flagColorTwo?: string,
}

