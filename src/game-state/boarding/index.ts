import { AIFactory } from "../../factory";
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
    boardingShip: Ship, boardedShip: Ship, boardingAction: BoardingAction, aiFactory: AIFactory
) => {
    boardingShip.marines = boardingAction.boardingParty
    boardedShip.faction = boardingShip.faction
    boardedShip.ai = aiFactory.escort(boardingShip.id, boardedShip.id)
}

const progressBoardingAction = (boardingAction: BoardingAction, gameState: GameState, aiFactory: AIFactory): boolean => {

    const boardingShip = gameState.ships.find(_ => _.id == boardingAction.boardingShipId)
    const boardedShip = gameState.ships.find(_ => _.id == boardingAction.boardedShipId)

    if (!boardedShip || !boardingShip || boardingAction.boardingParty <= 0) {
        return true
    }
    if (gameState.cycleNumber % BATTLE_PERIOD === 0) {
        boardedShip.marines = boardedShip.marines - 1
        if (boardedShip.marines <= 0) {
            captureShip(boardingShip, boardedShip, boardingAction, aiFactory)
            return true
        }
        boardingAction.boardingParty = boardingAction.boardingParty - 1
    }
    return false
}

export const handleBoardingActions = (gameState: GameState, aiFactory: AIFactory) => {
    gameState.boardingActions.forEach(boardingAction => {
        boardingAction.resolved = progressBoardingAction(boardingAction, gameState, aiFactory)
    })
    gameState.boardingActions = gameState.boardingActions.filter(_ => !_.resolved)
}
