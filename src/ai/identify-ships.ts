import type { GameState, Town, Ship } from "../game-state"
import { Rect, getDistance, isPointInsideRect } from "../lib/geometry"
import { splitArray } from "../lib/util"

export const identifyShips = (observer: Ship | Town, gameState: GameState, sightRange: number) => {
    const sightRect: Rect = {
        top: observer.y - sightRange,
        left: observer.x - sightRange,
        bottom: observer.y + sightRange,
        right: observer.x + sightRange,
    }
    const nearbyShips = gameState.ships
        .filter(otherShip => observer !== otherShip && isPointInsideRect(otherShip, sightRect))
        .filter(otherShip => getDistance(otherShip, observer) <= sightRange)
    const [enemies, allies] = splitArray(nearbyShips, (otherShip) => otherShip.faction !== observer.faction)
    return { enemies, allies }
}