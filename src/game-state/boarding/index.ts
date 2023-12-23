import { BoardingAction, GameState } from "../model";


export const progressBoardingAction = (boardingAction: BoardingAction, gameState: GameState): boolean => {

    const boardingShip = gameState.ships.find(_ => _.id == boardingAction.boardingShipId)
    const boardedShip = gameState.ships.find(_ => _.id == boardingAction.boardedShipId)

    console.log({ boardedShip, boardingShip })
    if (!boardedShip || !boardingShip) {
        return true
    }
    return false
}

export const handleBoardingActions = (gameState: GameState) => {
    gameState.boardingActions.forEach(boardingAction => {
        boardingAction.resolved = progressBoardingAction(boardingAction, gameState)
    })
    gameState.boardingActions = gameState.boardingActions.filter(_ => !_.resolved)
}
