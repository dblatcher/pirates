import { AIFactory } from "../../factory";
import { splitArray, sum } from "../../lib/util";
import { BATTLE_PERIOD, GameState, InvadingAction, Ship, Town } from "../model";


const captureTown = (town: Town, ship: Ship, _action: InvadingAction, gameState: GameState) => {
    const allActionsOnThisTown = gameState.invadingActions.filter(_ => _.townId === town.id);
    // TO DO - add the faction to the invadingAction to avoid this mess
    const isActionBySameFaction = (otherAction: InvadingAction): boolean => {
        const otherShip = gameState.ships.find(_ => _.id == otherAction.attackingShipId)
        return !!otherShip && otherShip.faction == ship.faction
    }
    const [actionsFromSameFaction] = splitArray(allActionsOnThisTown, isActionBySameFaction)
    const totalTroopForSameFaction = sum(actionsFromSameFaction.map(_ => _.numberOfAttackers))
    actionsFromSameFaction.forEach(action => { action.resolved = true })

    town.faction = ship.faction
    // TO DO - return the excess troops?
    town.garrison = Math.min(totalTroopForSameFaction, town.profile.maxGarrison)
    // TO DO - add a nice visual effect 
}

const progressInvadingAction = (action: InvadingAction, gameState: GameState, _aiFactory: AIFactory): boolean => {
    const ship = gameState.ships.find(_ => _.id == action.attackingShipId)
    const town = gameState.towns.find(_ => _.id == action.townId)

    if (!town || !ship || action.numberOfAttackers <= 0) {
        return true
    }
    
    // TO DO - can you invade and sail away? game logic question
    // if (getDistance(ship, town) > TOWN_SIZE + INVASION_RANGE) {
        // return true
    // }

    if (gameState.cycleNumber % BATTLE_PERIOD === 0) {
        town.garrison = town.garrison - 1
        if (town.garrison <= 0) {
            captureTown(town, ship, action, gameState)
            return true
        }
        action.numberOfAttackers = action.numberOfAttackers - 1
    }
    return false
}


export const handleInvadingActions = (gameState: GameState, _aiFactory: AIFactory) => {
    gameState.invadingActions.forEach(action => {
        action.resolved = progressInvadingAction(action, gameState, _aiFactory)
    })
    gameState.invadingActions = gameState.invadingActions.filter(_ => !_.resolved)
}