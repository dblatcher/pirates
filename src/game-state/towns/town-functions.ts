import { Ship, Town, GameState } from "../model";

export const getTownShipIsInvading = (ship: Ship, gameState: GameState): Town | undefined => {
    const action = gameState.invadingActions.find(_ => _.attackingShipId === ship.id)
    if (!action) { return undefined }
    return gameState.towns.find(town => town.id === action.townId)
}

export const townIsBeingInvaded = (town: Town, gameState: GameState): boolean => gameState.invadingActions.some(action => action.townId === town.id)
