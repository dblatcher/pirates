import { Ship } from "../../game-state/ship"
import { GameState } from "../../game-state"
import { Rect, isPointInsideRect } from "../../lib/geometry"
import { splitArray } from "../../lib/util"


export const identifyShips = (ship: Ship, gameState: GameState, sightRange = 300) => {
    const sightRect: Rect = {
        top: ship.y - sightRange,
        left: ship.x - sightRange,
        bottom: ship.y + sightRange,
        right: ship.x + sightRange,
    }
    const nearbyShips = gameState.ships.filter(otherShip => ship !== otherShip && isPointInsideRect(otherShip, sightRect))
    const [enemies, allies] = splitArray(nearbyShips, (otherShip) => otherShip.faction !== ship.faction)
    return {enemies, allies}
}