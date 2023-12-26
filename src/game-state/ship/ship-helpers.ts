import { expandRect, isPointInsideRect } from "../../lib/geometry";
import { viewPortToRect } from "../helpers";
import { GameState, ViewPort } from "../model";
import { Ship } from "../model";

export const isShipInView = (ship: Ship, viewPort: ViewPort): boolean => {
    const rect = expandRect(viewPortToRect(viewPort), ship.length)
    return isPointInsideRect(ship, rect)
}

export const describeShipWithId = (ship: Ship) => ship.name ? `${ship.name}(#${ship.id})` : `SHIP#${ship.id}`

export const isBoarding = (ship: Ship, gameState: GameState) => {
    return gameState.boardingActions.some(boardingAction => boardingAction.attackingShipId === ship.id)
}

export const isBeingBoarded = (ship: Ship, gameState: GameState) => {
    return gameState.boardingActions.some(boardingAction => boardingAction.boardedShipId === ship.id)
}