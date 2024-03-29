import { AIFactory } from "../../factory";
import { BATTLE_PERIOD, BoardingAction, GameState, Ship } from "../model";

export const startBoardingAction = (boardingShip: Ship, boardedShip: Ship, gameState: GameState) => {
    gameState.boardingActions.push({
        boardedShipId: boardedShip.id,
        attackingShipId: boardingShip.id,
        resolved: false,
        numberOfAttackers: boardingShip.marines
    })
    boardingShip.marines = 0
}


const captureShip = (
    boardingShip: Ship, boardedShip: Ship, boardingAction: BoardingAction, aiFactory: AIFactory
) => {
    boardingShip.marines = boardingAction.numberOfAttackers
    boardedShip.faction = boardingShip.faction
    boardedShip.ai = aiFactory.follow(boardingShip.id)
}

const progressBoardingAction = (action: BoardingAction, gameState: GameState, aiFactory: AIFactory): boolean => {

    const boardingShip = gameState.ships.find(_ => _.id == action.attackingShipId)
    const boardedShip = gameState.ships.find(_ => _.id == action.boardedShipId)

    if (!boardedShip || !boardingShip || action.numberOfAttackers <= 0) {
        return true
    }
    if (gameState.cycleNumber % BATTLE_PERIOD === 0) {
        boardedShip.marines = boardedShip.marines - 1
        if (boardedShip.marines <= 0) {
            captureShip(boardingShip, boardedShip, action, aiFactory)
            return true
        }
        action.numberOfAttackers = action.numberOfAttackers - 1
    }
    return false
}

export const handleBoardingActions = (gameState: GameState, aiFactory: AIFactory) => {
    gameState.boardingActions.forEach(boardingAction => {
        boardingAction.resolved = progressBoardingAction(boardingAction, gameState, aiFactory)
    })
    gameState.boardingActions = gameState.boardingActions.filter(_ => !_.resolved)
}
