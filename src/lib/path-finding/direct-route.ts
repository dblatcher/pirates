import { GameState, Ship } from "../../game-state";
import { XY } from "../geometry";
import { CellMatrix } from "./types";


export const isDirectPathTo = (
    targetPoint: XY,
    ship: Ship,
    gameState: GameState,
    cellMatrix: CellMatrix,
): boolean => {

    return true
}