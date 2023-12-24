import { BATTLE_PERIOD, BoardingAction, GameState, Ship } from "../model";

export const startBoardingAction = (boardingShip: Ship, boardedShip: Ship, gameState: GameState) => {
    gameState.boardingActions.push({
        boardedShipId: boardedShip.id,
        boardingShipId: boardingShip.id,
        resolved: false,
        boardingParty: boardingShip.marines
    })
    boardingShip.marines = 0
}


const captureShip = (
    boardingShip: Ship, boardedShip: Ship, boardingAction: BoardingAction,
) => {
    boardingShip.marines = boardingAction.boardingParty
    boardedShip.faction = boardingShip.faction
}

const progressBoardingAction = (boardingAction: BoardingAction, gameState: GameState): boolean => {

    const boardingShip = gameState.ships.find(_ => _.id == boardingAction.boardingShipId)
    const boardedShip = gameState.ships.find(_ => _.id == boardingAction.boardedShipId)

    if (!boardedShip || !boardingShip || boardingAction.boardingParty <= 0) {
        return true
    }
    if (gameState.cycleNumber % BATTLE_PERIOD === 0) {
        boardedShip.marines = boardedShip.marines - 1
        if (boardedShip.marines <= 0) {
            captureShip(boardingShip, boardedShip, boardingAction)
            return true
        }
        boardingAction.boardingParty = boardingAction.boardingParty - 1
    }
    return false
}

export const handleBoardingActions = (gameState: GameState) => {
    gameState.boardingActions.forEach(boardingAction => {
        boardingAction.resolved = progressBoardingAction(boardingAction, gameState)
    })
    gameState.boardingActions = gameState.boardingActions.filter(_ => !_.resolved)
}
